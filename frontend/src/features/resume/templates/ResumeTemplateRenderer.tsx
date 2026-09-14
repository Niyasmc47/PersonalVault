import type { ResumeContent, ResumeTemplate } from '../types';
import ProfessionalTemplate from './ProfessionalTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import AtsFriendlyTemplate from './AtsFriendlyTemplate';
import AcademicTemplate from './AcademicTemplate';

interface ResumeTemplateRendererProps {
  template: ResumeTemplate;
  content: ResumeContent;
}

export default function ResumeTemplateRenderer({
  template,
  content,
}: ResumeTemplateRendererProps) {
  switch (template) {
    case 'MODERN':
      return <ModernTemplate content={content} />;
    case 'MINIMAL':
      return <MinimalTemplate content={content} />;
    case 'ATS_FRIENDLY':
      return <AtsFriendlyTemplate content={content} />;
    case 'ACADEMIC':
      return <AcademicTemplate content={content} />;
    case 'PROFESSIONAL':
    default:
      return <ProfessionalTemplate content={content} />;
  }
}
