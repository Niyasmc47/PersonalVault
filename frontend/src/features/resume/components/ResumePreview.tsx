import { forwardRef } from 'react';
import type { ResumeContent, ResumeTemplate } from '../types';
import ResumeTemplateRenderer from '../templates/ResumeTemplateRenderer';

interface ResumePreviewProps {
  template: ResumeTemplate;
  content: ResumeContent;
  scale?: number;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ template, content, scale = 1 }, ref) => {
    return (
      <div className="pv-resume-preview-wrapper">
        <div
          ref={ref}
          id="pv-resume-printable-area"
          className="pv-resume-sheet-container"
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          <ResumeTemplateRenderer template={template} content={content} />
        </div>
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
