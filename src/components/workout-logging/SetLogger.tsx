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
      <h4 className="font-medium text-lg text-white">Log Your Sets</h4>
      <div className="space-y-4">
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">{selectedExercise.name}</CardTitle>
            <p className="text-sm text-neutral-400">{selectedExercise.muscleGroup}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exerciseSets.length > 0 ? (
                <>
                  {exerciseSets.map((set) => (
                    <div 
                      key={set.id} 
                      className="p-4 border border-neutral-700 rounded-lg transition-all bg-neutral-900"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-neutral-400">
                          Set {set.setNo}
                        </span>
                        <div className="flex items-center gap-2">
                          {savingSetIds.has(set.id) && (
                            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Saving...</span>
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveSet(set.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-neutral-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`weight-${set.id}`} className="text-sm font-medium text-neutral-300">Weight (Kg)</Label>
                          <Input
                            id={`weight-${set.id}`}
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={set.weight || ''}
                            onChange={(e) => onUpdateSet(set.id, { 
                              weight: e.target.value ? parseFloat(e.target.value) : null 
                            })}
                            className="w-full bg-neutral-800 border-neutral-700 text-white"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`reps-${set.id}`} className="text-sm font-medium text-neutral-300">Reps</Label>
                          <Input
                            id={`reps-${set.id}`}
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={set.reps || ''}
                            onChange={(e) => onUpdateSet(set.id, { 
                              reps: e.target.value ? parseInt(e.target.value) : null 
                            })}
                            className="w-full bg-neutral-800 border-neutral-700 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-6 text-neutral-500">
                  <p className="text-sm">Click &quot;+ Add Set&quot; to start logging sets for this exercise</p>
                </div>
              )}
              
              <Button
                size="sm"
                onClick={onAddNewSet}
                className="w-full gap-2 bg-white text-neutral-950 hover:bg-neutral-200"
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

