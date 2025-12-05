import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QAService, Question, Answer, QuestionListItem } from '../../../core/services/community/qa.service';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-6">
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else if (question()) {
        <a routerLink="/community/qa" class="text-blue-600 hover:underline mb-4 inline-block">← Back to Questions</a>
        
        <!-- Question -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
          <div class="p-6">
            <div class="flex gap-4">
              <!-- Voting -->
              <div class="flex flex-col items-center gap-1">
                <button (click)="voteQuestion('Up')" 
                        [class]="question()!.isVotedUp ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'"
                        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4l-8 8h6v8h4v-8h6z"/>
                  </svg>
                </button>
                <span class="text-2xl font-bold" [class]="question()!.voteCount > 0 ? 'text-green-600' : question()!.voteCount < 0 ? 'text-red-600' : ''">
                  {{ question()!.voteCount }}
                </span>
                <button (click)="voteQuestion('Down')"
                        [class]="question()!.isVotedDown ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'"
                        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 20l8-8h-6V4h-4v8H4z"/>
                  </svg>
                </button>
                <button (click)="toggleBookmark()" 
                        [class]="question()!.isBookmarked ? 'text-yellow-500' : 'text-gray-400'"
                        class="p-2 mt-2" title="Bookmark">
                  {{ question()!.isBookmarked ? '🔖' : '📑' }}
                </button>
              </div>

              <!-- Content -->
              <div class="flex-1">
                <div class="flex items-start justify-between gap-4 mb-4">
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ question()!.title }}</h1>
                  @if (question()!.bountyPoints) {
                    <span class="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full whitespace-nowrap">
                      +{{ question()!.bountyPoints }} bounty
                    </span>
                  }
                </div>

                <div class="prose dark:prose-invert max-w-none mb-4">
                  <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ question()!.content }}</p>
                </div>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mb-4">
                  @for (tag of question()!.tags; track tag) {
                    <a [routerLink]="['/community/qa']" [queryParams]="{tag: tag}"
                       class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded hover:bg-blue-200">
                      {{ tag }}
                    </a>
                  }
                </div>

                <!-- Meta -->
                <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t dark:border-gray-700">
                  <div class="flex gap-4 text-sm">
                    <button class="text-gray-500 hover:text-gray-700">Share</button>
                    <button class="text-gray-500 hover:text-gray-700">Edit</button>
                    <button class="text-gray-500 hover:text-gray-700">Follow</button>
                  </div>
                  <div class="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div class="text-xs text-gray-500">
                      asked {{ question()!.createdAt | date:'MMM d, yyyy' }}
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-medium">
                        {{ question()!.author.firstName[0] }}{{ question()!.author.lastName[0] }}
                      </div>
                      <div>
                        <p class="text-sm font-medium text-blue-600">
                          {{ question()!.author.firstName }} {{ question()!.author.lastName }}
                          @if (question()!.author.isVerified) { <span class="text-blue-500">✓</span> }
                        </p>
                        <p class="text-xs text-gray-500">{{ question()!.author.reputation }} reputation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Answers Section -->
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {{ answers().length }} Answer{{ answers().length !== 1 ? 's' : '' }}
          </h2>

          @for (answer of answers(); track answer.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-4"
                 [class]="answer.isAccepted ? 'ring-2 ring-green-500' : ''">
              <div class="p-6">
                <div class="flex gap-4">
                  <!-- Voting -->
                  <div class="flex flex-col items-center gap-1">
                    <button (click)="voteAnswer(answer.id, 'Up')"
                            [class]="answer.isVotedUp ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'"
                            class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4l-8 8h6v8h4v-8h6z"/>
                      </svg>
                    </button>
                    <span class="text-xl font-bold">{{ answer.voteCount }}</span>
                    <button (click)="voteAnswer(answer.id, 'Down')"
                            [class]="answer.isVotedDown ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'"
                            class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 20l8-8h-6V4h-4v8H4z"/>
                      </svg>
                    </button>
                    @if (answer.isAccepted) {
                      <span class="text-green-500 text-2xl mt-2" title="Accepted Answer">✓</span>
                    } @else {
                      <button (click)="acceptAnswer(answer.id)" 
                              class="text-gray-300 hover:text-green-500 text-2xl mt-2" title="Accept Answer">
                        ○
                      </button>
                    }
                  </div>

                  <!-- Content -->
                  <div class="flex-1">
                    @if (answer.isAccepted) {
                      <div class="mb-3 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-lg inline-block">
                        ✓ Accepted Answer
                      </div>
                    }
                    <div class="prose dark:prose-invert max-w-none mb-4">
                      <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ answer.content }}</p>
                    </div>

                    <!-- Meta -->
                    <div class="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                      <div class="flex gap-4 text-sm">
                        <button class="text-gray-500 hover:text-gray-700">Share</button>
                        <button class="text-gray-500 hover:text-gray-700">Edit</button>
                      </div>
                      <div class="flex items-center gap-2 text-sm">
                        <span class="text-gray-500">answered {{ answer.createdAt | date:'MMM d' }}</span>
                        <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                          {{ answer.author.firstName[0] }}{{ answer.author.lastName[0] }}
                        </div>
                        <span class="text-blue-600">{{ answer.author.firstName }}</span>
                        <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {{ answer.author.reputation }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Your Answer -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Answer</h3>
          <textarea [(ngModel)]="newAnswer" rows="6" 
                    placeholder="Write your answer here. Be detailed and helpful."
                    class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 mb-4"></textarea>
          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-500">
              Thanks for contributing! Make sure your answer adds value.
            </p>
            <button (click)="submitAnswer()" 
                    [disabled]="!newAnswer.trim()"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Post Your Answer
            </button>
          </div>
        </div>

        <!-- Related Questions -->
        @if (relatedQuestions().length > 0) {
          <div class="mt-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Questions</h3>
            <div class="space-y-2">
              @for (related of relatedQuestions(); track related.id) {
                <a [routerLink]="['/community/qa', related.slug]" 
                   class="block p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div class="flex items-center gap-3">
                    <span [class]="related.hasAcceptedAnswer ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'"
                          class="px-2 py-1 rounded text-xs font-medium">
                      {{ related.answerCount }} answers
                    </span>
                    <span class="text-blue-600 hover:text-blue-800 line-clamp-1">{{ related.title }}</span>
                  </div>
                </a>
              }
            </div>
          </div>
        }
      } @else {
        <div class="text-center py-12">
          <p class="text-4xl mb-4">❓</p>
          <p class="text-gray-500">Question not found</p>
          <a routerLink="/community/qa" class="text-blue-600 hover:underline mt-4 inline-block">Browse all questions</a>
        </div>
      }
    </div>
  `
})
export class QuestionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private qaService = inject(QAService);

  question = signal<Question | null>(null);
  answers = signal<Answer[]>([]);
  relatedQuestions = signal<QuestionListItem[]>([]);
  loading = signal(true);
  newAnswer = '';

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.qaService.getQuestionBySlug(slug).subscribe({
        next: (q) => {
          this.question.set(q);
          this.loading.set(false);
          this.loadAnswers(q.id);
          this.loadRelatedQuestions(q.id);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  loadAnswers(questionId: string) {
    this.qaService.getAnswers(questionId).subscribe({
      next: (answers) => this.answers.set(answers)
    });
  }

  loadRelatedQuestions(questionId: string) {
    this.qaService.getRelatedQuestions(questionId, 5).subscribe({
      next: (questions: QuestionListItem[]) => this.relatedQuestions.set(questions)
    });
  }

  voteQuestion(type: 'Up' | 'Down') {
    const q = this.question();
    if (q) {
      this.qaService.voteQuestion(q.id, type).subscribe({
        next: (result) => this.question.set({ ...q, voteCount: result.voteCount })
      });
    }
  }

  toggleBookmark() {
    const q = this.question();
    if (!q) return;
    const action = q.isBookmarked ? this.qaService.unbookmarkQuestion(q.id) : this.qaService.bookmarkQuestion(q.id);
    action.subscribe({
      next: () => this.question.set({ ...q, isBookmarked: !q.isBookmarked })
    });
  }

  voteAnswer(answerId: string, type: 'Up' | 'Down') {
    this.qaService.voteAnswer(answerId, type).subscribe({
      next: (result) => {
        this.answers.update(answers =>
          answers.map(a => a.id === answerId ? { ...a, voteCount: result.voteCount } : a)
        );
      }
    });
  }

  acceptAnswer(answerId: string) {
    this.qaService.acceptAnswer(answerId).subscribe({
      next: () => {
        this.answers.update(answers =>
          answers.map(a => ({ ...a, isAccepted: a.id === answerId }))
        );
        const q = this.question();
        if (q) this.question.set({ ...q, acceptedAnswerId: answerId });
      }
    });
  }

  submitAnswer() {
    const q = this.question();
    if (!q || !this.newAnswer.trim()) return;

    this.qaService.createAnswer(q.id, { content: this.newAnswer }).subscribe({
      next: (answer) => {
        this.answers.update(answers => [...answers, answer]);
        this.newAnswer = '';
      }
    });
  }
}
