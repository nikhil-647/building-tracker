import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddExerciseButton } from '@/components/add-exercise-button'
import { DeleteExerciseButton } from '@/components/delete-exercise-button'
import { getMuscleGroupIcon, GymIcon, gymIcons } from '@/lib/gym-icons'
import type { MuscleGroup, GroupedExercise } from '@/types/workout'

interface WorkoutPlanListProps {
  muscleGroups: MuscleGroup[]
  userExercisePlan: {
    [key: string]: GroupedExercise[]
  }
}

export function WorkoutPlanList({ muscleGroups, userExercisePlan }: WorkoutPlanListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Muscle Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {muscleGroups.map((muscleGroup) => {
            const exercises = userExercisePlan[muscleGroup.name] || []
            const MuscleIcon = getMuscleGroupIcon(muscleGroup.name)
            
            return (
              <Card key={muscleGroup.id} className="overflow-hidden hover:bg-accent/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GymIcon icon={MuscleIcon} className="h-5 w-5 text-primary" />
                      <div className="px-3 py-1 rounded-full text-sm font-medium border bg-primary/10 text-primary border-primary/20">
                        {muscleGroup.name}
                      </div>
                    </div>
                    <AddExerciseButton muscleGroup={muscleGroup.name} />
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {exercises.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <GymIcon icon={MuscleIcon} className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No exercises added yet</p>
                        <p className="text-sm">Click &quot;Add Exercise&quot; to get started</p>
                      </div>
                    ) : (
                      exercises.map((exercise) => (
                        <div 
                          key={exercise.planId}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <GymIcon icon={MuscleIcon} className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{exercise.name}</span>
                          </div>
                          <DeleteExerciseButton 
                            planId={exercise.planId}
                            exerciseName={exercise.name}
                            muscleGroup={muscleGroup.name}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

