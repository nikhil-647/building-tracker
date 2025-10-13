'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { getMuscleGroupIcon, GymIcon } from '@/lib/gym-icons'
import type { MuscleGroup } from '@/types/workout'

interface MuscleGroupSelectorProps {
  muscleGroups: MuscleGroup[]
  selectedMuscleGroups: string[]
  onToggleMuscleGroup: (muscleGroup: string) => void
}

export function MuscleGroupSelector({ 
  muscleGroups, 
  selectedMuscleGroups, 
  onToggleMuscleGroup 
}: MuscleGroupSelectorProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-lg">Select Muscle Group</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {muscleGroups.map((muscleGroup) => {
          const MuscleIcon = getMuscleGroupIcon(muscleGroup.name)
          return (
            <Button
              key={muscleGroup.id}
              variant={selectedMuscleGroups.includes(muscleGroup.name) ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-center gap-2 ${
                selectedMuscleGroups.includes(muscleGroup.name) 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
              onClick={() => onToggleMuscleGroup(muscleGroup.name)}
            >
              <GymIcon icon={MuscleIcon} className="h-5 w-5" />
              <span className="text-sm font-medium">{muscleGroup.name}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

