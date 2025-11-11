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
      <h4 className="font-medium text-lg text-white">Select Muscle Group</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {muscleGroups.map((muscleGroup) => {
          const MuscleIcon = getMuscleGroupIcon(muscleGroup.name)
          const isSelected = selectedMuscleGroups.includes(muscleGroup.name)
          return (
            <Button
              key={muscleGroup.id}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-center gap-2 transition-all ${
                isSelected
                  ? 'bg-white text-neutral-950 hover:bg-neutral-200 border-white'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600 hover:text-white'
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

