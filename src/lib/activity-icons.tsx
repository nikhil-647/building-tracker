import React from 'react'
import { 
  Activity, Calendar, Droplets, Moon, Book, Heart, TrendingUp, TrendingDown,
  Dumbbell, Bike, Footprints, Zap, Target, Award, Trophy,
  Apple, Coffee, Utensils, Pizza, Wine, Salad, Cookie,
  Brain, Smile, Sparkles, Sun, Cloud, Wind, Flame,
  Clock, Timer, CheckCircle, Star, Flag,
  Music, Headphones, Gamepad2, Tv, Monitor, Laptop,
  Pill, Stethoscope, Thermometer, Syringe, CircleDot,
  Brush, Palette, Camera, Image as ImageIcon, Film, Video,
  ShoppingCart, DollarSign, Wallet, CreditCard,
  Users, User, Baby, Dog, Cat, Home, Car
} from 'lucide-react'

export function getActivityIcon(icon: string) {
  const iconMap: Record<string, React.ReactNode> = {
    // General Activity
    'activity': <Activity className="h-5 w-5" />,
    'zap': <Zap className="h-5 w-5" />,
    'target': <Target className="h-5 w-5" />,
    'trending-up': <TrendingUp className="h-5 w-5" />,
    'trending-down': <TrendingDown className="h-5 w-5" />,
    'circle-dot': <CircleDot className="h-5 w-5" />,
    
    // Fitness & Exercise
    'dumbbell': <Dumbbell className="h-5 w-5" />,
    'zap-cardio': <Zap className="h-5 w-5" />,
    'bike': <Bike className="h-5 w-5" />,
    'footprints': <Footprints className="h-5 w-5" />,
    'award': <Award className="h-5 w-5" />,
    'trophy': <Trophy className="h-5 w-5" />,
    
    // Health & Wellness
    'heart': <Heart className="h-5 w-5" />,
    'droplets': <Droplets className="h-5 w-5" />,
    'moon': <Moon className="h-5 w-5" />,
    'sun': <Sun className="h-5 w-5" />,
    'brain': <Brain className="h-5 w-5" />,
    'smile': <Smile className="h-5 w-5" />,
    'sparkles': <Sparkles className="h-5 w-5" />,
    
    // Medical
    'pill': <Pill className="h-5 w-5" />,
    'stethoscope': <Stethoscope className="h-5 w-5" />,
    'thermometer': <Thermometer className="h-5 w-5" />,
    'syringe': <Syringe className="h-5 w-5" />,
    
    // Food & Nutrition
    'apple': <Apple className="h-5 w-5" />,
    'utensils': <Utensils className="h-5 w-5" />,
    'coffee': <Coffee className="h-5 w-5" />,
    'salad': <Salad className="h-5 w-5" />,
    'pizza': <Pizza className="h-5 w-5" />,
    'wine': <Wine className="h-5 w-5" />,
    'cookie': <Cookie className="h-5 w-5" />,
    
    // Productivity & Learning
    'book': <Book className="h-5 w-5" />,
    'clock': <Clock className="h-5 w-5" />,
    'timer': <Timer className="h-5 w-5" />,
    'calendar': <Calendar className="h-5 w-5" />,
    'check-circle': <CheckCircle className="h-5 w-5" />,
    'star': <Star className="h-5 w-5" />,
    'flag': <Flag className="h-5 w-5" />,
    
    // Entertainment & Hobbies
    'music': <Music className="h-5 w-5" />,
    'headphones': <Headphones className="h-5 w-5" />,
    'gamepad': <Gamepad2 className="h-5 w-5" />,
    'tv': <Tv className="h-5 w-5" />,
    'monitor': <Monitor className="h-5 w-5" />,
    'laptop': <Laptop className="h-5 w-5" />,
    'camera': <Camera className="h-5 w-5" />,
    'image': <ImageIcon className="h-5 w-5" />,
    'brush': <Brush className="h-5 w-5" />,
    'palette': <Palette className="h-5 w-5" />,
    'film': <Film className="h-5 w-5" />,
    'video': <Video className="h-5 w-5" />,
    
    // Finance
    'dollar-sign': <DollarSign className="h-5 w-5" />,
    'wallet': <Wallet className="h-5 w-5" />,
    'credit-card': <CreditCard className="h-5 w-5" />,
    'shopping-cart': <ShoppingCart className="h-5 w-5" />,
    
    // Environment & Weather
    'cloud': <Cloud className="h-5 w-5" />,
    'wind': <Wind className="h-5 w-5" />,
    'flame': <Flame className="h-5 w-5" />,
    
    // Social & Family
    'users': <Users className="h-5 w-5" />,
    'user': <User className="h-5 w-5" />,
    'baby': <Baby className="h-5 w-5" />,
    'dog': <Dog className="h-5 w-5" />,
    'cat': <Cat className="h-5 w-5" />,
    'home': <Home className="h-5 w-5" />,
    'car': <Car className="h-5 w-5" />,
  }
  return iconMap[icon] || <Activity className="h-5 w-5" />
}

