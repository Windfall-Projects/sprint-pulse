'use client'

import { Card } from '@/components/ui/Card'
import { HeartIcon } from '@heroicons/react/24/outline'

export function SurveysList({ surveys, teamId, isLead }: { surveys: any[], teamId: string, isLead: boolean }) {
  if (surveys.length === 0) {
    return (
      <Card glass className="p-8 text-center text-muted-foreground border-dashed">
        No surveys found for this team.
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {surveys.map((survey) => (
        <Card key={survey.id} glass className="p-6 relative group border-t-4 border-t-primary">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              {survey.is_system_template && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase">Template</span>}
              {survey.title}
            </h3>
          </div>
          
          <p className="text-sm text-foreground/80 mb-6 line-clamp-2 min-h-[40px]">
            {survey.description || 'No description provided.'}
          </p>

          <div className="font-mono text-xs text-muted-foreground mb-6">
            Questions: {survey.survey_questions[0]?.count || 0}
          </div>

          <div className="flex gap-2">
             <button className="flex-1 bg-primary text-white py-2 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
              Take Survey
            </button>
            {isLead && !survey.is_system_template && (
              <button className="px-3 bg-surface border border-white/10 text-foreground py-2 rounded-md hover:bg-white/5 transition-colors text-sm font-medium">
                Results
              </button>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
