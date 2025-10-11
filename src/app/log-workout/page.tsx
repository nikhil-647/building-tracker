'use client'

import * as React from 'react'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Trash2, 
  Dumbbell, 
  ChevronDown, 
  ChevronRight,
  Save,
  Calendar,
  Clock,
  Check,
  X
} from 'lucide-react'
import { AddExerciseModal } from '@/components/add-exercise-modal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock data based on schema
const muscleGroups = [
  { id: 1, name: 'Chest', color: 'bg-green-50 text-green-800 border-green-200' },
  { id: 2, name: 'Back', color: 'bg-green-50 text-green-800 border-green-200' },
  { id: 3, name: 'Shoulder', color: 'bg-green-50 text-green-800 border-green-200' },
  { id: 4, name: 'Legs', color: 'bg-green-50 text-green-800 border-green-200' },
  { id: 5, name: 'Bicep', color: 'bg-green-50 text-green-800 border-green-200' },
  { id: 6, name: 'Tricep', color: 'bg-green-50 text-green-800 border-green-200' },
  { id: 7, name: 'Abs', color: 'bg-green-50 text-green-800 border-green-200' },
  { id: 8, name: 'Cardio', color: 'bg-green-50 text-green-800 border-green-200' },
]

const mockExercises = {
  Chest: [
    { id: 1, name: 'Bench Press', image: null },
    { id: 2, name: 'Incline Dumbbell Press', image: null },
    { id: 3, name: 'Push-ups', image: null },
    { id: 4, name: 'Chest Flyes', image: null },
  ],
  Back: [
    { id: 5, name: 'Pull-ups', image: null },
    { id: 6, name: 'Bent-over Rows', image: null },
    { id: 7, name: 'Lat Pulldowns', image: null },
    { id: 8, name: 'Deadlifts', image: null },
  ],
  Shoulder: [
    { id: 9, name: 'Overhead Press', image: null },
    { id: 10, name: 'Lateral Raises', image: null },
    { id: 11, name: 'Rear Delt Flyes', image: null },
  ],
  Legs: [
    { id: 12, name: 'Squats', image: null },
    { id: 13, name: 'Lunges', image: null },
    { id: 14, name: 'Leg Press', image: null },
    { id: 15, name: 'Calf Raises', image: null },
  ],
  Bicep: [
    { id: 16, name: 'Bicep Curls', image: null },
    { id: 17, name: 'Hammer Curls', image: null },
    { id: 18, name: 'Preacher Curls', image: null },
  ],
  Tricep: [
    { id: 19, name: 'Tricep Dips', image: null },
    { id: 20, name: 'Overhead Tricep Extension', image: null },
    { id: 21, name: 'Close-grip Bench Press', image: null },
  ],
  Abs: [
    { id: 22, name: 'Plank', image: null },
    { id: 23, name: 'Crunches', image: null },
    { id: 24, name: 'Russian Twists', image: null },
  ],
  Cardio: [
    { id: 25, name: 'Running', image: null },
    { id: 26, name: 'Cycling', image: null },
    { id: 27, name: 'Rowing', image: null },
  ],
}

interface Exercise {
  id: number
  name: string
  image: string | null
}

interface WorkoutPlan {
  id: number
  muscleGroups: {
    [key: string]: Exercise[]
  }
}

interface ExerciseSet {
  id: string
  exerciseId: number
  exerciseName: string
  muscleGroup: string
  setNo: number
  weight: number | null
  reps: number | null
  completed: boolean
}

interface WorkoutSession {
  id: string
  date: string
  muscleGroups: string[]
  exercises: ExerciseSet[]
}

export default function LogWorkout() {
  const [workoutPlan, setWorkoutPlan] = React.useState<WorkoutPlan>({
    id: 1,
    muscleGroups: {
      Chest: [mockExercises.Chest[0], mockExercises.Chest[1]],
      Back: [mockExercises.Back[0], mockExercises.Back[1]],
      Legs: [mockExercises.Legs[0], mockExercises.Legs[1]],
    }
  })
  const [expandedMuscleGroups, setExpandedMuscleGroups] = React.useState<Set<string>>(new Set(['Chest', 'Back']))
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = React.useState(false)
  const [isWorkoutPlanExpanded, setIsWorkoutPlanExpanded] = React.useState(false)
  
  // Workout logging state
  const [isWorkoutActive, setIsWorkoutActive] = React.useState(false)
  const [selectedMuscleGroups, setSelectedMuscleGroups] = React.useState<string[]>([])
  const [selectedExercise, setSelectedExercise] = React.useState<{id: number, name: string, muscleGroup: string} | null>(null)
  const [currentWorkoutSession, setCurrentWorkoutSession] = React.useState<WorkoutSession>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    muscleGroups: [],
    exercises: []
  })

  const user = {
    name: "John Doe",
    email: "john@example.com",
    image: null
  }

  const toggleMuscleGroup = (muscleGroup: string) => {
    const newExpanded = new Set(expandedMuscleGroups)
    if (newExpanded.has(muscleGroup)) {
      newExpanded.delete(muscleGroup)
    } else {
      newExpanded.add(muscleGroup)
    }
    setExpandedMuscleGroups(newExpanded)
  }

  const addExerciseToMuscleGroup = (exerciseName: string, muscleGroup: string) => {
    const newExercise: Exercise = {
      id: Date.now(),
      name: exerciseName,
      image: null
    }

    setWorkoutPlan(prev => ({
      ...prev,
      muscleGroups: {
        ...prev.muscleGroups,
        [muscleGroup]: [...(prev.muscleGroups[muscleGroup] || []), newExercise]
      }
    }))
  }

  const removeExerciseFromMuscleGroup = (muscleGroup: string, exerciseId: number) => {
    setWorkoutPlan(prev => ({
      ...prev,
      muscleGroups: {
        ...prev.muscleGroups,
        [muscleGroup]: prev.muscleGroups[muscleGroup]?.filter(ex => ex.id !== exerciseId) || []
      }
    }))
  }

  // Workout logging functions
  const startWorkout = () => {
    setIsWorkoutActive(true)
    setCurrentWorkoutSession(prev => ({
      ...prev,
      id: `workout-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    }))
  }

  const toggleMuscleGroupSelection = (muscleGroup: string) => {
    setSelectedMuscleGroups(prev => {
      // If clicking the same muscle group, deselect it
      if (prev.includes(muscleGroup)) {
        return []
      }
      
      // Otherwise, select only this muscle group (single selection)
      const newSelection = [muscleGroup]
      
      // Smooth scroll to Add Exercises section when muscle group is selected
      setTimeout(() => {
        const addExercisesSection = document.getElementById('add-exercises-section')
        if (addExercisesSection) {
          addExercisesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
      
      return newSelection
    })
  }

  const selectExercise = (exercise: Exercise, muscleGroup: string) => {
    // Set the selected exercise
    setSelectedExercise({
      id: exercise.id,
      name: exercise.name,
      muscleGroup
    })

    // Add the first set for this exercise
    const newSet: ExerciseSet = {
      id: `set-${Date.now()}-${Math.random()}`,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      muscleGroup,
      setNo: 1,
      weight: null,
      reps: null,
      completed: false
    }

    setCurrentWorkoutSession(prev => ({
      ...prev,
      exercises: [...prev.exercises, newSet]
    }))

    // Smooth scroll to the Log Your Sets section after selecting exercise
    setTimeout(() => {
      const logSection = document.getElementById('log-sets-section')
      if (logSection) {
        logSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const updateExerciseSet = (setId: string, updates: Partial<ExerciseSet>) => {
    setCurrentWorkoutSession(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => 
        exercise.id === setId ? { ...exercise, ...updates } : exercise
      )
    }))
  }

  const addNewSet = () => {
    if (!selectedExercise) return

    const existingSets = currentWorkoutSession.exercises.filter(ex => 
      ex.exerciseId === selectedExercise.id && ex.muscleGroup === selectedExercise.muscleGroup
    )
    const nextSetNo = existingSets.length + 1

    const newSet: ExerciseSet = {
      id: `set-${Date.now()}-${Math.random()}`,
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      muscleGroup: selectedExercise.muscleGroup,
      setNo: nextSetNo,
      weight: null,
      reps: null,
      completed: false
    }

    setCurrentWorkoutSession(prev => ({
      ...prev,
      exercises: [...prev.exercises, newSet]
    }))

    // Smooth scroll to the new set after a brief delay
    setTimeout(() => {
      const logSection = document.getElementById('log-sets-section')
      if (logSection) {
        logSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }, 100)
  }

  const removeSet = (setId: string) => {
    setCurrentWorkoutSession(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== setId)
    }))
  }



  const filteredMuscleGroups = muscleGroups

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Log Workout</h1>
            <p className="text-muted-foreground text-lg">
              Track your daily exercises and log your sets with weight and reps.
            </p>
          </div>
        </div>

        {/* Workout Plan Header */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => setIsWorkoutPlanExpanded(!isWorkoutPlanExpanded)}
          >
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-bold">My Workout Plan</span>
              {isWorkoutPlanExpanded ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Workout Plan Editor */}
        {isWorkoutPlanExpanded && (
          <Card>
            <CardHeader>
              <CardTitle>Muscle Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMuscleGroups.map((muscleGroup) => {
                  const exercises = workoutPlan.muscleGroups[muscleGroup.name] || []
                  const isExpanded = expandedMuscleGroups.has(muscleGroup.name)
                  
                  return (
                    <Card key={muscleGroup.id} className="overflow-hidden">
                      <CardHeader 
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => toggleMuscleGroup(muscleGroup.name)}
                      >
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${muscleGroup.color}`}>
                              {muscleGroup.name}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsAddExerciseModalOpen(true)
                            }}
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Add Exercise
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      
                      {isExpanded && (
                        <CardContent className="pt-0">
                          {/* Exercise List */}
                          <div className="space-y-2">
                            {exercises.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
                                <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No exercises added yet</p>
                                <p className="text-sm">Click "Add Exercise" to get started</p>
                              </div>
                            ) : (
                              exercises.slice(0, 2).map((exercise) => (
                                <div 
                                  key={exercise.id}
                                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{exercise.name}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeExerciseFromMuscleGroup(muscleGroup.name, exercise.id)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))
                            )}
                            {exercises.length > 2 && (
                              <div className="text-center py-2 text-muted-foreground text-sm">
                                +{exercises.length - 2} more exercises
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Log Workouts for Today */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Log Workouts for Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isWorkoutActive ? (
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">No workouts logged today</p>
                  <p className="text-sm">Start your workout to begin logging exercises</p>
                </div>
                <div className="flex justify-center">
                  <Button size="lg" className="gap-2" onClick={startWorkout}>
                    <Dumbbell className="h-5 w-5" />
                    Start Today's Workout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Workout Session Header */}
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border">
                  <div>
                    <h3 className="font-semibold text-lg">Active Workout Session</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()} • {currentWorkoutSession.exercises.length} exercises
                    </p>
                  </div>
                </div>

                {/* Muscle Group Selection */}
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Select Muscle Group</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {muscleGroups.map((muscleGroup) => (
                      <Button
                        key={muscleGroup.id}
                        variant={selectedMuscleGroups.includes(muscleGroup.name) ? "default" : "outline"}
                        className={`h-auto p-4 flex flex-col items-center gap-2 ${
                          selectedMuscleGroups.includes(muscleGroup.name) 
                            ? 'bg-[#145700] text-white hover:bg-[#0f4200]'
                            : 'border-[#145700] text-[#145700] hover:bg-[#145700] hover:text-white'
                        }`}
                        onClick={() => toggleMuscleGroupSelection(muscleGroup.name)}
                      >
                        <Dumbbell className="h-5 w-5" />
                        <span className="text-sm font-medium">{muscleGroup.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Exercise Selection */}
                {selectedMuscleGroups.length > 0 && (
                  <div id="add-exercises-section" className="space-y-4 scroll-mt-4">
                    <h4 className="font-medium text-lg">Add Exercises</h4>
                    <div className="grid gap-4">
                      {selectedMuscleGroups.map((muscleGroupName) => {
                        const muscleGroup = muscleGroups.find(mg => mg.name === muscleGroupName)
                        const exercises = mockExercises[muscleGroupName as keyof typeof mockExercises] || []
                        
                        return (
                          <Card key={muscleGroupName}>
                            <CardHeader>
                              <CardTitle className="text-lg text-[#145700]">
                                {muscleGroupName} Exercises
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {exercises.map((exercise) => {
                                  const isSelected = selectedExercise?.id === exercise.id && selectedExercise?.muscleGroup === muscleGroupName
                                  return (
                                    <Button
                                      key={exercise.id}
                                      variant={isSelected ? "default" : "outline"}
                                      className={`justify-start h-auto p-3 ${
                                        isSelected 
                                          ? 'bg-[#145700] text-white hover:bg-[#0f4200]' 
                                          : 'border-[#145700] text-[#145700] hover:bg-[#145700] hover:text-white'
                                      }`}
                                      onClick={() => selectExercise(exercise, muscleGroupName)}
                                    >
                                      <Dumbbell className="h-4 w-4 mr-2" />
                                      {exercise.name}
                                    </Button>
                                  )
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Exercise Sets Logging */}
                {selectedExercise && (
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
                            {currentWorkoutSession.exercises
                              .filter(ex => ex.exerciseId === selectedExercise.id && ex.muscleGroup === selectedExercise.muscleGroup)
                              .map((set) => (
                                <div key={set.id} className="p-4 border rounded-lg bg-card">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-muted-foreground">Set {set.setNo}</span>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant={set.completed ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => updateExerciseSet(set.id, { completed: !set.completed })}
                                      >
                                        {set.completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeSet(set.id)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`weight-${set.id}`} className="text-sm font-medium">Weight (lbs)</Label>
                                      <Input
                                        id={`weight-${set.id}`}
                                        type="number"
                                        placeholder="0"
                                        value={set.weight || ''}
                                        onChange={(e) => updateExerciseSet(set.id, { 
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
                                        placeholder="0"
                                        value={set.reps || ''}
                                        onChange={(e) => updateExerciseSet(set.id, { 
                                          reps: e.target.value ? parseInt(e.target.value) : null 
                                        })}
                                        className="w-full"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={addNewSet}
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
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Exercise Modal */}
      <AddExerciseModal
        isOpen={isAddExerciseModalOpen}
        onClose={() => setIsAddExerciseModalOpen(false)}
        onSave={addExerciseToMuscleGroup}
      />
    </div>
  )
}
