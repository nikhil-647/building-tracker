'use client'

import { useState, useTransition } from 'react'
import { 
  toggleActivityComplete, 
  createActivityTemplate, 
  updateActivityTemplate, 
  deleteActivityTemplate 
} from '@/app/api/activity/actions'
import type { ActivityTemplate, ActivityProgress } from '@/types/activity'

export function useActivityManagement(
  initialTemplates: ActivityTemplate[],
  initialProgress: ActivityProgress[]
) {
  const [templates, setTemplates] = useState<ActivityTemplate[]>(initialTemplates)
  const [progress, setProgress] = useState<ActivityProgress[]>(initialProgress)
  const [isPending, startTransition] = useTransition()

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today.toISOString().split('T')[0]
  }

  // Toggle activity completion
  const handleToggleComplete = async (activityId: string) => {
    const currentProgress = progress.find(p => p.activityId === activityId)
    const newCompletedState = !currentProgress?.completed

    // Optimistic update
    setProgress(prev => {
      const existing = prev.find(p => p.activityId === activityId)
      
      if (existing) {
        return prev.map(p => 
          p.activityId === activityId 
            ? { ...p, completed: newCompletedState }
            : p
        )
      } else {
        return [...prev, { activityId, completed: newCompletedState }]
      }
    })

    // Persist to database
    startTransition(async () => {
      const result = await toggleActivityComplete(
        parseInt(activityId),
        getTodayDate(),
        newCompletedState
      )

      if (!result.success) {
        console.error('Failed to toggle activity:', result.error)
        // Revert optimistic update on error
        setProgress(prev => {
          const existing = prev.find(p => p.activityId === activityId)
          
          if (existing) {
            return prev.map(p => 
              p.activityId === activityId 
                ? { ...p, completed: !newCompletedState }
                : p
            )
          } else {
            return prev.filter(p => p.activityId !== activityId)
          }
        })
      }
    })
  }

  // Add new activity template
  const handleAddTemplate = async (
    name: string,
    description: string,
    icon: string
  ) => {
    const result = await createActivityTemplate(name, description, icon)

    if (result.success && result.data) {
      // Add to local state
      setTemplates(prev => [...prev, {
        id: result.data.id.toString(),
        name: result.data.name,
        description: result.data.description,
        icon: result.data.icon,
        selected: false
      }])
    } else {
      console.error('Failed to create activity:', result.error)
    }
  }

  // Update existing activity template
  const handleUpdateTemplate = async (
    templateId: string,
    name: string,
    description: string,
    icon: string
  ) => {
    // Optimistic update
    const oldTemplates = [...templates]
    setTemplates(prev => 
      prev.map(t => 
        t.id === templateId 
          ? { ...t, name, description, icon }
          : t
      )
    )

    const result = await updateActivityTemplate(
      parseInt(templateId),
      name,
      description,
      icon
    )

    if (!result.success) {
      console.error('Failed to update activity:', result.error)
      // Revert on error
      setTemplates(oldTemplates)
    }
  }

  // Delete activity template
  const handleDeleteTemplate = async (templateId: string) => {
    // Optimistic update
    const oldTemplates = [...templates]
    setTemplates(prev => prev.filter(t => t.id !== templateId))

    const result = await deleteActivityTemplate(parseInt(templateId))

    if (!result.success) {
      console.error('Failed to delete activity:', result.error)
      // Revert on error
      setTemplates(oldTemplates)
    }
  }

  return {
    templates,
    progress,
    isPending,
    handleToggleComplete,
    handleAddTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate
  }
}

