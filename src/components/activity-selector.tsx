'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { AddActivityModal } from '@/components/add-activity-modal'
import { getActivityIcon } from '../lib/activity-icons'
import type { ActivityTemplate } from '@/types/activity'

interface ActivitySelectorProps {
  templates: ActivityTemplate[]
  onAddTemplate: (name: string, description: string, icon: string) => Promise<void>
  onUpdateTemplate: (templateId: string, name: string, description: string, icon: string) => Promise<void>
  onDeleteTemplate: (templateId: string) => Promise<void>
  isPending?: boolean
}

export function ActivitySelector({ 
  templates, 
  onAddTemplate, 
  onUpdateTemplate, 
  onDeleteTemplate,
  isPending 
}: ActivitySelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<ActivityTemplate | null>(null)

  const handleAddActivity = async (activity: {
    name: string
    description: string
    icon: string
  }) => {
    if (editingActivity) {
      // Update existing activity
      await onUpdateTemplate(
        editingActivity.id,
        activity.name,
        activity.description,
        activity.icon
      )
      setEditingActivity(null)
    } else {
      // Add new activity
      await onAddTemplate(
        activity.name,
        activity.description,
        activity.icon
      )
    }
    setIsModalOpen(false)
  }

  const handleEditActivity = (activity: ActivityTemplate) => {
    setEditingActivity(activity)
    setIsModalOpen(true)
  }

  const handleDeleteActivity = async (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this activity?')) {
      await onDeleteTemplate(templateId)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingActivity(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Daily Activities</CardTitle>
              <CardDescription>
                Manage your activities - all activities are automatically tracked below
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              size="sm"
              className="gap-2"
              disabled={isPending}
            >
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No activities yet. Click &quot;Add Activity&quot; to create your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] md:max-h-none overflow-y-auto pr-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="relative p-4 rounded-lg border-2 border-border bg-card transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-secondary text-foreground">
                      {getActivityIcon(template.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{template.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {template.description}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleEditActivity(template)}
                      className="p-1.5 rounded-md hover:bg-secondary/80 transition-colors"
                      title="Edit activity"
                      disabled={isPending}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteActivity(e, template.id)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                      title="Delete activity"
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddActivity}
        editActivity={editingActivity}
      />
    </>
  )
}

