'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import type { ExerciseSet } from '@/types/workout'

interface SetLoggerProps {
  selectedExercise: { id: number; name: string; muscleGroup: string } | null
  exerciseSets: ExerciseSet[]
  savingSetIds: Set<string>
  onAddNewSet: () => void
  onUpdateSet: (setId: string, updates: Partial<ExerciseSet>) => void
  onRemoveSet: (setId: string) => void
}

// Helper functions for input validation
const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = [46, 8, 9, 27, 13, 110, 190] // Delete, Backspace, Tab, Escape, Enter, Decimal
  const isModifierKey = e.ctrlKey || e.metaKey
  const isNavigationKey = e.keyCode >= 35 && e.keyCode <= 40 // Home, End, Arrows
  const isNumberKey = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) // 0-9
  const isCopyPaste = isModifierKey && [65, 67, 86, 88].includes(e.keyCode) // Ctrl/Cmd+A/C/V/X
  
  if (allowedKeys.includes(e.keyCode) || isNavigationKey || isCopyPaste || (!e.shiftKey && isNumberKey)) {
    return
  }
  
  e.preventDefault()
}

const handleDecimalInput = (e: React.FormEvent<HTMLInputElement>) => {
  const target = e.target as HTMLInputElement
  target.value = target.value.replace(/[^0-9.]/g, '')
  
  // Prevent multiple decimal points
  const parts = target.value.split('.')
  if (parts.length > 2) {
    target.value = parts[0] + '.' + parts.slice(1).join('')
  }
}

const handleIntegerInput = (e: React.FormEvent<HTMLInputElement>) => {
  const target = e.target as HTMLInputElement
  target.value = target.value.replace(/[^0-9]/g, '')
}

export function SetLogger({ 
  selectedExercise,
  exerciseSets,
  savingSetIds,
  onAddNewSet,
  onUpdateSet,
  onRemoveSet
}: SetLoggerProps) {
  if (!selectedExercise) {
    return null
  }

  return (
    <div id="log-sets-section" className="space-y-4 scroll-mt-4">
      <h4 className="font-medium text-lg">Log Your Sets</h4>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{selectedExercise.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{selectedExercise.muscleGroup}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exerciseSets.length > 0 ? (
                <>
                  {exerciseSets.map((set) => (
                    <div 
                      key={set.id} 
                      className="p-4 border rounded-lg transition-all bg-card"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          Set {set.setNo}
                        </span>
                        <div className="flex items-center gap-2">
                          {savingSetIds.has(set.id) && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Saving...</span>
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveSet(set.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`weight-${set.id}`} className="text-sm font-medium">Weight (Kg)</Label>
                          <Input
                            id={`weight-${set.id}`}
                            type="number"
                            placeholder="0"
                            value={set.weight || ''}
                            onChange={(e) => onUpdateSet(set.id, { 
                              weight: e.target.value ? parseFloat(e.target.value) : null 
                            })}
                            onKeyDown={handleNumericKeyDown}
                            onInput={handleDecimalInput}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`reps-${set.id}`} className="text-sm font-medium">Reps</Label>
                          <Input
                            id={`reps-${set.id}`}
                            type="number"
                            placeholder="0"
                            value={set.reps || ''}
                            onChange={(e) => onUpdateSet(set.id, { 
                              reps: e.target.value ? parseInt(e.target.value) : null 
                            })}
                            onKeyDown={handleNumericKeyDown}
                            onInput={handleIntegerInput}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="text-sm">Click &quot;+ Add Set&quot; to start logging sets for this exercise</p>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={onAddNewSet}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Set
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

