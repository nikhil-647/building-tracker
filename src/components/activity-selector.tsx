'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil } from 'lucide-react'
import { AddActivityModal } from '@/components/add-activity-modal'
import { getActivityIcon } from '@/lib/activity-icons'
import type { ActivityTemplate } from '@/types/activity'

interface ActivitySelectorProps {
  templates: ActivityTemplate[]
  onTemplatesChange: (templates: ActivityTemplate[]) => void
}

export function ActivitySelector({ templates, onTemplatesChange }: ActivitySelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<ActivityTemplate | null>(null)

  const handleAddActivity = (activity: {
    name: string
    description: string
    icon: string
  }) => {
    if (editingActivity) {
      // Update existing activity
      onTemplatesChange(
        templates.map(t => 
          t.id === editingActivity.id 
            ? { ...t, ...activity }
            : t
        )
      )
      setEditingActivity(null)
    } else {
      // Add new activity
      const newActivity: ActivityTemplate = {
        id: `custom-${Date.now()}`,
        ...activity,
        selected: false
      }
      onTemplatesChange([...templates, newActivity])
    }
  }

  const handleEditActivity = (activity: ActivityTemplate) => {
    setEditingActivity(activity)
    setIsModalOpen(true)
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
            >
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                <button
                  onClick={() => handleEditActivity(template)}
                  className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-secondary/80 transition-colors"
                  title="Edit activity"
                >
                  <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))}
          </div>
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

