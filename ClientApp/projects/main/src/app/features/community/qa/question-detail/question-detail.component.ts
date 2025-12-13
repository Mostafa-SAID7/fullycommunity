import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QAService } from '../../../../core/services/community/qa';
import { Question, Answer } from '../../../../core/interfaces/community/qa';

import { QuestionHeaderComponent } from '../components/question-header/question-header.component';
import { AnswerListComponent } from '../components/answer-list/answer-list.component';
import { AnswerFormComponent } from '../components/answer-form/answer-form.component';
import { RelatedQuestionsComponent } from '../components/related-questions/related-questions.component';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [
    CommonModule,
    QuestionHeaderComponent,
    AnswerListComponent,
    AnswerFormComponent,
    RelatedQuestionsComponent
  ],
  templateUrl: './question-detail.component.html'
})
export class QuestionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qaService = inject(QAService);

  question = signal<Question | null>(null);
  answers = signal<Answer[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  submitError = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadQuestion(id);
    }
  }

  loadQuestion(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.qaService.getQuestion(id).subscribe({
      next: (question: any) => {
        this.question.set(question);
        this.loadAnswers(id);
      },
      error: (err: any) => {
        console.error('Failed to load question:', err);
        this.error.set('Failed to load question');
        this.loading.set(false);
      }
    });
  }

  loadAnswers(questionId: string) {
    this.qaService.getAnswers(questionId).subscribe({
      next: (answers: any) => {
        this.answers.set(answers);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load answers:', err);
        this.loading.set(false);
      }
    });
  }

  onAnswerSubmitted() {
    const questionId = this.question()?.id;
    if (questionId) {
      this.loadQuestion(questionId);
    }
  }

  onAnswersUpdated(updatedAnswers: Answer[]) {
    this.answers.set(updatedAnswers);
  }

  scrollToAnswerForm() {
    document.getElementById('answer-form')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  goBack() {
    this.router.navigate(['/community/qa']);
  }

  voteQuestion(voteType: 1 | -1) {
    const currentQuestion = this.question();
    if (!currentQuestion) return;

    const currentVote = currentQuestion.currentUserVote || 0;

    this.qaService.voteQuestion(currentQuestion.id, voteType).subscribe({
      next: (result: any) => {
        const newUserVote = currentVote === voteType ? 0 : voteType;
        this.question.set({
          ...currentQuestion,
          voteCount: result.voteCount,
          currentUserVote: newUserVote
        });
      },
      error: (err: any) => {
        console.error('Failed to vote on question:', err);
        if (err.status === 401) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        } else {
          this.submitError.set('Failed to vote. Please try again.');
        }
      }
    });
  }

  voteAnswer(event: { answerId: string; voteType: 1 | -1 }) {
    const currentAnswers = this.answers();
    const answer = currentAnswers.find(a => a.id === event.answerId);
    if (!answer) return;

    const currentVote = answer.currentUserVote || 0;

    this.qaService.voteAnswer(event.answerId, event.voteType).subscribe({
      next: (result: any) => {
        const newUserVote = currentVote === event.voteType ? 0 : event.voteType;
        const updatedAnswers = currentAnswers.map(a =>
          a.id === event.answerId
            ? { ...a, voteCount: result.voteCount, currentUserVote: newUserVote }
            : a
        );
        this.answers.set(updatedAnswers);
      },
      error: (err: any) => {
        console.error('Failed to vote on answer:', err);
        if (err.status === 401) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        } else {
          this.submitError.set('Failed to vote. Please try again.');
        }
      }
    });
  }
}
