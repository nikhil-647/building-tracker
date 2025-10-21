'use client'

import React, { useState } from 'react'
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

const QUICK_WEIGHTS = [2.5, 5, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 45]

export function SetLogger({ 
  selectedExercise,
  exerciseSets,
  savingSetIds,
  onAddNewSet,
  onUpdateSet,
  onRemoveSet
}: SetLoggerProps) {
  const [focusedSetId, setFocusedSetId] = useState<string | null>(null)

  const handleQuickWeightSelect = (weight: number) => {
    if (focusedSetId) {
      onUpdateSet(focusedSetId, { weight })
    }
  }

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
                            inputMode="decimal"
                            placeholder="0"
                            value={set.weight || ''}
                            onFocus={() => setFocusedSetId(set.id)}
                            onBlur={() => setTimeout(() => setFocusedSetId(null), 200)}
                            onChange={(e) => onUpdateSet(set.id, { 
                              weight: e.target.value ? parseFloat(e.target.value) : null 
                            })}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`reps-${set.id}`} className="text-sm font-medium">Reps</Label>
                          <Input
                            id={`reps-${set.id}`}
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={set.reps || ''}
                            onChange={(e) => onUpdateSet(set.id, { 
                              reps: e.target.value ? parseInt(e.target.value) : null 
                            })}
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

      {/* Quick Weight Selector */}
      {focusedSetId && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="text-xs font-medium text-muted-foreground mb-2 text-center">
              Quick Weight (Kg)
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_WEIGHTS.map((weight) => (
                <Button
                  key={weight}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickWeightSelect(weight)}
                  className="min-w-[60px] font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {weight}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

