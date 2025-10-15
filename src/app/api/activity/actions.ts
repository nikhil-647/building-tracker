'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { ActivityStatusEnum } from '@prisma/client'

/**
 * Toggle activity completion status for a specific date
 * Creates or updates the DailyActivity record
 */
export async function toggleActivityComplete(
  templateId: number,
  date: string,
  completed: boolean
) {
  try {
    // Check authentication
    const session = await auth()
    
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Convert date string (YYYY-MM-DD) to Date object in local timezone
    const [year, month, day] = date.split('-').map(Number)
    const activityDate = new Date(year, month - 1, day)
    activityDate.setHours(0, 0, 0, 0)

    // Upsert the daily activity (update if exists, create if not)
    const dailyActivity = await db.dailyActivity.upsert({
      where: {
        templateId_userId_date: {
          templateId: templateId,
          userId: user.id,
          date: activityDate
        }
      },
      update: {
        status: completed ? ActivityStatusEnum.completed : ActivityStatusEnum.pending
      },
      create: {
        templateId: templateId,
        userId: user.id,
        date: activityDate,
        status: completed ? ActivityStatusEnum.completed : ActivityStatusEnum.pending
      }
    })

    return { 
      success: true, 
      data: {
        id: dailyActivity.id,
        templateId: dailyActivity.templateId,
        status: dailyActivity.status,
        completed: dailyActivity.status === ActivityStatusEnum.completed
      }
    }
  } catch (error: unknown) {
    console.error('Error toggling activity complete:', error)
    
    // Handle foreign key constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
      return { success: false, error: 'Invalid activity template' }
    }
    
    return { success: false, error: 'Failed to update activity status' }
  }
}

/**
 * Create a new activity template for the user
 */
export async function createActivityTemplate(
  name: string,
  description: string,
  icon: string
) {
  try {
    // Check authentication
    const session = await auth()
    
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Create the activity template
    const template = await db.activityTemplate.create({
      data: {
        userId: user.id,
        name,
        description,
        icon,
        isActive: true
      }
    })

    return { 
      success: true, 
      data: {
        id: template.id,
        name: template.name,
        description: template.description,
        icon: template.icon,
        isActive: template.isActive
      }
    }
  } catch (error) {
    console.error('Error creating activity template:', error)
    return { success: false, error: 'Failed to create activity template' }
  }
}

/**
 * Update an existing activity template
 */
export async function updateActivityTemplate(
  templateId: number,
  name: string,
  description: string,
  icon: string
) {
  try {
    // Check authentication
    const session = await auth()
    
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Update the activity template (only if it belongs to the user)
    const template = await db.activityTemplate.updateMany({
      where: {
        id: templateId,
        userId: user.id
      },
      data: {
        name,
        description,
        icon
      }
    })

    if (template.count === 0) {
      return { success: false, error: 'Activity template not found or unauthorized' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating activity template:', error)
    return { success: false, error: 'Failed to update activity template' }
  }
}

/**
 * Delete an activity template
 * This will cascade delete all associated daily activities
 */
export async function deleteActivityTemplate(templateId: number) {
  try {
    // Check authentication
    const session = await auth()
    
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Delete the activity template (only if it belongs to the user)
    const deleted = await db.activityTemplate.deleteMany({
      where: {
        id: templateId,
        userId: user.id
      }
    })

    if (deleted.count === 0) {
      return { success: false, error: 'Activity template not found or unauthorized' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting activity template:', error)
    return { success: false, error: 'Failed to delete activity template' }
  }
}

/**
 * Get all activity templates and today's progress for a user
 */
export async function getActivityData(date: string) {
  try {
    // Check authentication
    const session = await auth()
    
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated', data: null }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return { success: false, error: 'User not found', data: null }
    }

    // Convert date string (YYYY-MM-DD) to Date object in local timezone
    const [year, month, day] = date.split('-').map(Number)
    const activityDate = new Date(year, month - 1, day)
    activityDate.setHours(0, 0, 0, 0)

    // Fetch all active activity templates for this user
    const templates = await db.activityTemplate.findMany({
      where: {
        userId: user.id,
        isActive: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Fetch daily activities for this date
    const dailyActivities = await db.dailyActivity.findMany({
      where: {
        userId: user.id,
        date: activityDate
      }
    })

    return { 
      success: true, 
      data: {
        templates: templates.map((t: {
          id: number
          name: string
          description: string
          icon: string
        }) => ({
          id: t.id.toString(),
          name: t.name,
          description: t.description,
          icon: t.icon,
          selected: false // This field might not be needed anymore
        })),
        progress: dailyActivities.map((da: {
          templateId: number
          status: ActivityStatusEnum
        }) => ({
          activityId: da.templateId.toString(),
          completed: da.status === ActivityStatusEnum.completed
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching activity data:', error)
    return { success: false, error: 'Failed to fetch activity data', data: null }
  }
}

