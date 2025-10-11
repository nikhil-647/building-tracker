'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dumbbell, Save, X } from 'lucide-react'

interface AddExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (exerciseName: string, muscleGroup: string) => void
}

const muscleGroups = [
  { value: 'Chest', label: 'Chest' },
  { value: 'Back', label: 'Back' },
  { value: 'Shoulder', label: 'Shoulder' },
  { value: 'Legs', label: 'Legs' },
  { value: 'Bicep', label: 'Bicep' },
  { value: 'Tricep', label: 'Tricep' },
  { value: 'Abs', label: 'Abs' },
  { value: 'Cardio', label: 'Cardio' },
]

export function AddExerciseModal({ isOpen, onClose, onSave }: AddExerciseModalProps) {
  const [exerciseName, setExerciseName] = React.useState('')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = React.useState('')
  const [errors, setErrors] = React.useState<{ name?: string; muscleGroup?: string }>({})

  const handleSave = () => {
    const newErrors: { name?: string; muscleGroup?: string } = {}
    
    if (!exerciseName.trim()) {
      newErrors.name = 'Exercise name is required'
    }
    
    if (!selectedMuscleGroup) {
      newErrors.muscleGroup = 'Please select a muscle group'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(exerciseName.trim(), selectedMuscleGroup)
    handleClose()
  }

  const handleClose = () => {
    setExerciseName('')
    setSelectedMuscleGroup('')
    setErrors({})
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Add New Exercise
          </DialogTitle>
          <DialogDescription>
            Create a new exercise and assign it to a muscle group.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="muscle-group">Muscle Group</Label>
            <Select
              value={selectedMuscleGroup}
              onValueChange={(value) => {
                setSelectedMuscleGroup(value)
                if (errors.muscleGroup) {
                  setErrors(prev => ({ ...prev, muscleGroup: undefined }))
                }
              }}
            >
              <SelectTrigger className={`w-full ${errors.muscleGroup ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Non selected" />
              </SelectTrigger>
              <SelectContent>
                {muscleGroups.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.muscleGroup && (
              <p className="text-sm text-destructive">{errors.muscleGroup}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Input
              id="exercise-name"
              placeholder="e.g., Bench Press, Squats, Push-ups..."
              value={exerciseName}
              onChange={(e) => {
                setExerciseName(e.target.value)
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: undefined }))
                }
              }}
              onKeyDown={handleKeyDown}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} className="gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Exercise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
