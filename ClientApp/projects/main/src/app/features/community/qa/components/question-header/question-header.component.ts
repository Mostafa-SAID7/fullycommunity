import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Question } from '../../../../../core/interfaces/community/qa';

@Component({
  selector: 'app-question-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './question-header.component.html'
})
export class QuestionHeaderComponent {
  // Inputs
  question = input.required<Question>();

  // Outputs
  vote = output<1 | -1>();
}
