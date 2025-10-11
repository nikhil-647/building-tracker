import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, MoreHorizontal, Calendar, MapPin, Users } from 'lucide-react'

interface Project {
  id: string
  name: string
  status: 'active' | 'completed' | 'pending'
  progress: number
  team: number
  location: string
  deadline: string
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Downtown Office Complex',
    status: 'active',
    progress: 75,
    team: 12,
    location: 'New York, NY',
    deadline: '2024-03-15'
  },
  {
    id: '2',
    name: 'Residential Tower A',
    status: 'active',
    progress: 45,
    team: 8,
    location: 'Los Angeles, CA',
    deadline: '2024-06-20'
  },
  {
    id: '3',
    name: 'Shopping Mall Renovation',
    status: 'pending',
    progress: 0,
    team: 5,
    location: 'Chicago, IL',
    deadline: '2024-08-10'
  },
  {
    id: '4',
    name: 'Warehouse Facility',
    status: 'completed',
    progress: 100,
    team: 15,
    location: 'Houston, TX',
    deadline: '2024-01-30'
  }
]

export function RecentProjects() {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'completed':
        return 'bg-blue-500'
      case 'pending':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Projects</CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockProjects.map((project) => (
          <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{project.name}</h3>
                <div className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`} />
                <span className="text-xs text-muted-foreground capitalize">{project.status}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{project.team} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(project.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="ml-4">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
