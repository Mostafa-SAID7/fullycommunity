import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ProfessionalProfile,
  Skill,
  Certification,
  WorkExperience,
  Education,
  PortfolioItem,
  SkillEndorsement
} from '../../interfaces/profile/profile-professional.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileProfessionalService {
  private readonly apiUrl = `${environment.apiUrl}/profile/professional`;

  constructor(private http: HttpClient) {}

  /**
   * Get professional profile
   */
  getProfessionalProfile(userId: string): Observable<ProfessionalProfile> {
    return this.http.get<ProfessionalProfile>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Update professional profile
   */
  updateProfessionalProfile(profile: Partial<ProfessionalProfile>): Observable<ProfessionalProfile> {
    return this.http.put<ProfessionalProfile>(this.apiUrl, profile);
  }

  /**
   * Add skill
   */
  addSkill(skill: Partial<Skill>): Observable<Skill> {
    return this.http.post<Skill>(`${this.apiUrl}/skills`, skill);
  }

  /**
   * Update skill
   */
  updateSkill(skillId: string, skill: Partial<Skill>): Observable<Skill> {
    return this.http.put<Skill>(`${this.apiUrl}/skills/${skillId}`, skill);
  }

  /**
   * Delete skill
   */
  deleteSkill(skillId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/skills/${skillId}`);
  }

  /**
   * Endorse skill
   */
  endorseSkill(userId: string, skillId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/skills/${skillId}/endorse`, { userId });
  }

  /**
   * Get skill endorsements
   */
  getSkillEndorsements(skillId: string): Observable<SkillEndorsement[]> {
    return this.http.get<SkillEndorsement[]>(`${this.apiUrl}/skills/${skillId}/endorsements`);
  }

  /**
   * Add certification
   */
  addCertification(certification: Partial<Certification>): Observable<Certification> {
    return this.http.post<Certification>(`${this.apiUrl}/certifications`, certification);
  }

  /**
   * Update certification
   */
  updateCertification(certId: string, certification: Partial<Certification>): Observable<Certification> {
    return this.http.put<Certification>(`${this.apiUrl}/certifications/${certId}`, certification);
  }

  /**
   * Delete certification
   */
  deleteCertification(certId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/certifications/${certId}`);
  }

  /**
   * Add work experience
   */
  addWorkExperience(experience: Partial<WorkExperience>): Observable<WorkExperience> {
    return this.http.post<WorkExperience>(`${this.apiUrl}/work-experience`, experience);
  }

  /**
   * Update work experience
   */
  updateWorkExperience(expId: string, experience: Partial<WorkExperience>): Observable<WorkExperience> {
    return this.http.put<WorkExperience>(`${this.apiUrl}/work-experience/${expId}`, experience);
  }

  /**
   * Delete work experience
   */
  deleteWorkExperience(expId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/work-experience/${expId}`);
  }

  /**
   * Add education
   */
  addEducation(education: Partial<Education>): Observable<Education> {
    return this.http.post<Education>(`${this.apiUrl}/education`, education);
  }

  /**
   * Update education
   */
  updateEducation(eduId: string, education: Partial<Education>): Observable<Education> {
    return this.http.put<Education>(`${this.apiUrl}/education/${eduId}`, education);
  }

  /**
   * Delete education
   */
  deleteEducation(eduId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/education/${eduId}`);
  }

  /**
   * Add portfolio item
   */
  addPortfolioItem(item: Partial<PortfolioItem>): Observable<PortfolioItem> {
    return this.http.post<PortfolioItem>(`${this.apiUrl}/portfolio`, item);
  }

  /**
   * Update portfolio item
   */
  updatePortfolioItem(itemId: string, item: Partial<PortfolioItem>): Observable<PortfolioItem> {
    return this.http.put<PortfolioItem>(`${this.apiUrl}/portfolio/${itemId}`, item);
  }

  /**
   * Delete portfolio item
   */
  deletePortfolioItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/portfolio/${itemId}`);
  }

  /**
   * Reorder portfolio items
   */
  reorderPortfolio(itemIds: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/portfolio/reorder`, { itemIds });
  }
}
