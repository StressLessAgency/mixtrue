import { Link } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'
import PageTransition from '@/components/layout/PageTransition'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import UsersTable from '@/components/admin/UsersTable'
import SessionsTable from '@/components/admin/SessionsTable'
import APIConfigForm from '@/components/admin/APIConfigForm'
import SystemHealthPanel from '@/components/admin/SystemHealthPanel'

export default function Admin() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-bg-primary">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent-cyan" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">
              mixtrue
            </span>
          </Link>
          <Link to="/app/upload" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Back to App
          </Link>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="font-display font-bold text-2xl text-text-primary mb-8">Admin Dashboard</h1>

          <Tabs defaultValue="health">
            <TabsList>
              <TabsTrigger value="health">System Health</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="config">API Config</TabsTrigger>
            </TabsList>

            <TabsContent value="health">
              <SystemHealthPanel />
            </TabsContent>

            <TabsContent value="users">
              <UsersTable />
            </TabsContent>

            <TabsContent value="sessions">
              <SessionsTable />
            </TabsContent>

            <TabsContent value="config">
              <APIConfigForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  )
}
