'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
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
import { 
  Save, X, Plus, Activity, Droplets, Moon, Book, Heart, TrendingUp,
  Dumbbell, Bike, Footprints, Zap, Target, Award, Trophy,
  Apple, Coffee, Utensils, Pizza, Wine, Salad, Cookie,
  Brain, Smile, Sparkles, Sun, Cloud, Wind, Flame,
  Clock, Timer, Calendar, CheckCircle, Star, Flag,
  Music, Headphones, Gamepad2, Tv, Monitor, Laptop,
  Pill, Stethoscope, Thermometer, Syringe, CircleDot,
  Brush, Palette, Camera, Image, Film, Video,
  ShoppingCart, DollarSign, Wallet, CreditCard, TrendingDown,
  Users, User, Baby, Dog, Cat, Home, Car
} from 'lucide-react'
interface AddActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (activity: {
    name: string
    description: string
    icon: string
  }) => void
  editActivity?: {
    id: string
    name: string
    description: string
    icon: string
  } | null
}

const activityIcons = [
  // General Activity
  { value: 'activity', label: 'Activity', icon: Activity },
  { value: 'zap', label: 'Energy', icon: Zap },
  { value: 'target', label: 'Target/Goal', icon: Target },
  { value: 'trending-up', label: 'Progress/Growth', icon: TrendingUp },
  { value: 'trending-down', label: 'Reduction', icon: TrendingDown },
  { value: 'circle-dot', label: 'Focus', icon: CircleDot },
  
  // Fitness & Exercise
  { value: 'dumbbell', label: 'Gym/Strength', icon: Dumbbell },
  { value: 'zap-cardio', label: 'Running/Cardio', icon: Zap },
  { value: 'bike', label: 'Cycling', icon: Bike },
  { value: 'footprints', label: 'Steps/Walking', icon: Footprints },
  { value: 'award', label: 'Achievement', icon: Award },
  { value: 'trophy', label: 'Victory/Win', icon: Trophy },
  
  // Health & Wellness
  { value: 'heart', label: 'Health/Love', icon: Heart },
  { value: 'droplets', label: 'Water/Hydration', icon: Droplets },
  { value: 'moon', label: 'Sleep/Rest', icon: Moon },
  { value: 'sun', label: 'Morning/Vitamin D', icon: Sun },
  { value: 'brain', label: 'Mental Health', icon: Brain },
  { value: 'smile', label: 'Happiness/Mood', icon: Smile },
  { value: 'sparkles', label: 'Meditation/Zen', icon: Sparkles },
  
  // Medical
  { value: 'pill', label: 'Medication', icon: Pill },
  { value: 'stethoscope', label: 'Doctor/Checkup', icon: Stethoscope },
  { value: 'thermometer', label: 'Temperature', icon: Thermometer },
  { value: 'syringe', label: 'Injection/Vaccine', icon: Syringe },
  
  // Food & Nutrition
  { value: 'apple', label: 'Fruit/Healthy Food', icon: Apple },
  { value: 'utensils', label: 'Meals', icon: Utensils },
  { value: 'coffee', label: 'Coffee/Caffeine', icon: Coffee },
  { value: 'salad', label: 'Salad/Vegetables', icon: Salad },
  { value: 'pizza', label: 'Fast Food', icon: Pizza },
  { value: 'wine', label: 'Alcohol', icon: Wine },
  { value: 'cookie', label: 'Snacks/Sweets', icon: Cookie },
  
  // Productivity & Learning
  { value: 'book', label: 'Reading/Learning', icon: Book },
  { value: 'clock', label: 'Time Management', icon: Clock },
  { value: 'timer', label: 'Pomodoro/Timer', icon: Timer },
  { value: 'calendar', label: 'Planning/Schedule', icon: Calendar },
  { value: 'check-circle', label: 'Task Complete', icon: CheckCircle },
  { value: 'star', label: 'Favorite/Priority', icon: Star },
  { value: 'flag', label: 'Milestone', icon: Flag },
  
  // Entertainment & Hobbies
  { value: 'music', label: 'Music', icon: Music },
  { value: 'headphones', label: 'Podcast/Audio', icon: Headphones },
  { value: 'gamepad', label: 'Gaming', icon: Gamepad2 },
  { value: 'tv', label: 'TV/Movies', icon: Tv },
  { value: 'monitor', label: 'Screen Time', icon: Monitor },
  { value: 'laptop', label: 'Computer Work', icon: Laptop },
  { value: 'camera', label: 'Photography', icon: Camera },
  { value: 'image', label: 'Art/Design', icon: Image },
  { value: 'brush', label: 'Painting/Creative', icon: Brush },
  { value: 'palette', label: 'Colors/Design', icon: Palette },
  { value: 'film', label: 'Video/Film', icon: Film },
  { value: 'video', label: 'Recording', icon: Video },
  
  // Finance
  { value: 'dollar-sign', label: 'Money/Savings', icon: DollarSign },
  { value: 'wallet', label: 'Spending', icon: Wallet },
  { value: 'credit-card', label: 'Payment', icon: CreditCard },
  { value: 'shopping-cart', label: 'Shopping', icon: ShoppingCart },
  
  // Environment & Weather
  { value: 'cloud', label: 'Weather', icon: Cloud },
  { value: 'wind', label: 'Fresh Air', icon: Wind },
  { value: 'flame', label: 'Heat/Calories', icon: Flame },
  
  // Social & Family
  { value: 'users', label: 'Social/Friends', icon: Users },
  { value: 'user', label: 'Personal', icon: User },
  { value: 'baby', label: 'Baby/Child Care', icon: Baby },
  { value: 'dog', label: 'Pet Care (Dog)', icon: Dog },
  { value: 'cat', label: 'Pet Care (Cat)', icon: Cat },
  { value: 'home', label: 'Home/Housework', icon: Home },
  { value: 'car', label: 'Commute/Travel', icon: Car },
]

export function AddActivityModal({ isOpen, onClose, onSave, editActivity }: AddActivityModalProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    icon: 'activity'
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Load edit data when modal opens
  React.useEffect(() => {
    if (isOpen && editActivity) {
      setFormData({
        name: editActivity.name,
        description: editActivity.description,
        icon: editActivity.icon
      })
    } else if (isOpen) {
      setFormData({
        name: '',
        description: '',
        icon: 'activity'
      })
    }
  }, [isOpen, editActivity])

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'activity'
    })
    setErrors({})
    onClose()
  }

  const handleSave = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Activity name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(formData)
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editActivity ? 'Edit Activity' : 'Add New Activity'}
          </DialogTitle>
          <DialogDescription>
            {editActivity 
              ? 'Update your activity details.' 
              : 'Create a custom activity to track your daily habits and goals.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Activity Name */}
          <div className="grid gap-2">
            <Label htmlFor="activity-name">Activity Name</Label>
            <Input
              id="activity-name"
              placeholder="e.g., 10K Steps, 8 Glasses of Water"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (errors.name) setErrors({ ...errors, name: '' })
              }}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Walk 10,000 steps today"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value })
                if (errors.description) setErrors({ ...errors, description: '' })
              }}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Icon */}
          <div className="grid gap-2">
            <Label htmlFor="icon">Icon</Label>
            <Select
              value={formData.icon}
              onValueChange={(value) => setFormData({ ...formData, icon: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {formData.icon && (
                    <div className="flex items-center gap-2">
                      {React.createElement(
                        activityIcons.find(i => i.value === formData.icon)?.icon || Activity,
                        { className: "h-4 w-4" }
                      )}
                      <span>{activityIcons.find(i => i.value === formData.icon)?.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {activityIcons.map((iconItem) => (
                  <SelectItem key={iconItem.value} value={iconItem.value}>
                    <div className="flex items-center gap-2">
                      <iconItem.icon className="h-4 w-4" />
                      <span>{iconItem.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {editActivity ? 'Update Activity' : 'Add Activity'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

