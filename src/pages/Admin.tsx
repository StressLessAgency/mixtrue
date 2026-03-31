import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/layout/PageTransition'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import UsersTable from '@/components/admin/UsersTable'
import SessionsTable from '@/components/admin/SessionsTable'
import APIConfigForm from '@/components/admin/APIConfigForm'
import SystemHealthPanel from '@/components/admin/SystemHealthPanel'
import AddUserModal from '@/components/admin/AddUserModal'

export default function Admin() {
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUserAdded = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <PageTransition>
      <div className="min-h-screen bg-bg-primary">
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border-subtle">
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={() => setAddUserOpen(true)}>
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add & Comp User</span>
              <span className="sm:hidden">Add</span>
            </Button>
            <Link to="/app/upload" className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors uppercase tracking-wider">
              App
            </Link>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
          <h1 className="font-display font-bold text-2xl text-text-primary mb-6">Admin Dashboard</h1>

          <Tabs defaultValue="health">
            <TabsList>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="config">Config</TabsTrigger>
            </TabsList>

            <TabsContent value="health">
              <SystemHealthPanel key={refreshKey} />
            </TabsContent>

            <TabsContent value="users">
              <UsersTable key={refreshKey} />
            </TabsContent>

            <TabsContent value="sessions">
              <SessionsTable />
            </TabsContent>

            <TabsContent value="config">
              <APIConfigForm />
            </TabsContent>
          </Tabs>
        </div>

        <AddUserModal
          open={addUserOpen}
          onClose={() => setAddUserOpen(false)}
          onUserAdded={handleUserAdded}
        />
      </div>
    </PageTransition>
  )
}
