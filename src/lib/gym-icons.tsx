import { 
  GiWeightLiftingUp, 
  GiMuscleUp, 
  GiBiceps,
  GiLeg,
  GiShoulderArmor,
  GiAbdominalArmor,
  GiRunningShoe,
  GiGymBag,
  GiStrongMan,
  GiMuscularTorso,
  GiSpineArrow,
} from 'react-icons/gi'
import { 
  FaDumbbell, 
  FaRunning,
  FaHeartbeat,
  FaFire,
} from 'react-icons/fa'
import { 
  IoMdFitness,
} from 'react-icons/io'
import { 
  CgGym,
} from 'react-icons/cg'
import { LucideIcon } from 'lucide-react'
import { IconType } from 'react-icons'

// Type that accepts both Lucide and React Icons
export type GymIconComponent = LucideIcon | IconType

// Map muscle groups to specific icons
export const muscleGroupIcons: Record<string, IconType> = {
  'Chest': GiMuscularTorso,
  'Back': GiSpineArrow,
  'Shoulder': GiShoulderArmor,
  'Legs': GiLeg,
  'Bicep': GiBiceps,
  'Tricep': GiMuscleUp,
  'Abs': GiAbdominalArmor,
  'Cardio': GiRunningShoe,
}

// Get icon for a specific muscle group
export const getMuscleGroupIcon = (muscleGroup: string): IconType => {
  return muscleGroupIcons[muscleGroup] || FaDumbbell
}

// General workout/gym icons for different contexts
export const gymIcons = {
  // General workout
  workout: GiWeightLiftingUp,
  gym: CgGym,
  fitness: IoMdFitness,
  dumbbell: FaDumbbell,
  
  // Activity tracking
  running: FaRunning,
  cardio: FaHeartbeat,
  calories: FaFire,
  
  // Strength
  strength: GiStrongMan,
  gymBag: GiGymBag,
}

// Icon wrapper component for consistent sizing
interface GymIconProps {
  icon: IconType
  className?: string
}

export const GymIcon = ({ icon: Icon, className = "h-5 w-5" }: GymIconProps) => {
  return <Icon className={className} />
}

