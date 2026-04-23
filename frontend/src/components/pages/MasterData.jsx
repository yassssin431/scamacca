import { useEffect, useState } from 'react'
import API_BASE_URL from '../../services/api'
import './MasterData.css'
import PageHeader from '../common/PageHeader'
import ConfirmModal from '../common/ConfirmModal'
import Toast from '../common/Toast'
import LoadingState from '../common/LoadingState'
import EmptyState from '../common/EmptyState'

function MasterData() {
  const [activeTab, setActiveTab] = useState('clients')

  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [employees, setEmployees] = useState([])
  const [categories, setCategories] = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [expenses, setExpenses] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)

    const [showConfirm, setShowConfirm] = useState(false)
const [selectedDelete, setSelectedDelete] = useState(null)
const [toast, setToast] = useState(null)

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: ''
  })
  const [editingClient, setEditingClient] = useState(null)

const [editClientData, setEditClientData] = useState({
  name: '',
  email: '',
  phone: '',
  company: '',
  address: '',
})
  const [newProject, setNewProject] = useState({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  status: 'Active',
  total_value: '',
  ClientId: '',
})
const [editingProject, setEditingProject] = useState(null)

const [editProjectData, setEditProjectData] = useState({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  status: 'Active',
  total_value: '',
  ClientId: '',
})
const [editingEmployee, setEditingEmployee] = useState(null)

const [editEmployeeData, setEditEmployeeData] = useState({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  position: '',
  hire_date: '',
  base_salary: '',
})
const [editingFournisseur, setEditingFournisseur] = useState(null)

const [editFournisseurData, setEditFournisseurData] = useState({
  name: '',
  email: '',
  phone: '',
  address: '',
  contact_person: '',
})
const [editingCategory, setEditingCategory] = useState(null)

const [editCategoryData, setEditCategoryData] = useState({
  name: '',
  description: '',
})
const showToastMessage = (message, type = 'success') => {
  setToast({ message, type })

  setTimeout(() => {
    setToast(null)
  }, 2500)
}

  const handleCreateClient = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newClient)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create client')
    }

    // Add new client to UI instantly
    setClients(prev => [...prev, result.data])

    setShowModal(false)

    // reset form
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: ''
    })

  } catch (err) {
    alert(err.message)
  }
}
const openEditClientModal = (client) => {
  setEditingClient(client)
  setEditClientData({
    name: client.name || '',
    email: client.email || '',
    phone: client.phone || '',
    company: client.company || '',
    address: client.address || '',
  })
}

const handleUpdateClient = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${editingClient.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editClientData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update client')
    }

    setClients((prev) =>
      prev.map((client) =>
        client.id === editingClient.id ? result.data : client
      )
    )

    setEditingClient(null)
  } catch (err) {
    alert(err.message)
  }
}

const handleDeleteClient = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete client')
    }

    setClients((prev) => prev.filter((client) => client.id !== id))
    showToastMessage('Client deleted successfully', 'success')
  } catch (err) {
    showToastMessage(err.message || 'Failed to delete client', 'error')
  } finally {
    setShowConfirm(false)
    setSelectedDelete(null)
  }
}
const handleCreateProject = async () => {
  if (!newProject.name || !newProject.total_value || !newProject.ClientId) {
  alert('Please fill project name, total value, and client.')
  return
}
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
     body: JSON.stringify({
  name: newProject.name,
  description: newProject.description || null,
  start_date: newProject.start_date || null,
  end_date: newProject.end_date || null,
  status: newProject.status,
  total_value: parseFloat(newProject.total_value),
  ClientId: parseInt(newProject.ClientId, 10),
})
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create project')
    }

    setProjects((prev) => [...prev, result.data])

    setShowModal(false)

    setNewProject({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      status: 'Active',
      total_value: '',
      ClientId: '',
    })
  } catch (err) {
    alert(err.message)
  }
}
const openEditProjectModal = (project) => {
  setEditingProject(project)
  setEditProjectData({
    name: project.name || '',
    description: project.description || '',
    start_date: project.start_date ? project.start_date.slice(0, 10) : '',
    end_date: project.end_date ? project.end_date.slice(0, 10) : '',
    status: project.status || 'Active',
    total_value: project.total_value || '',
    ClientId: project.ClientId || project.Client?.id || '',
  })
}

const handleUpdateProject = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${editingProject.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...editProjectData,
        total_value: Number(editProjectData.total_value),
        ClientId: Number(editProjectData.ClientId),
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update project')
    }

    setProjects((prev) =>
      prev.map((project) =>
        project.id === editingProject.id ? result.data : project
      )
    )

    setEditingProject(null)
  } catch (err) {
    alert(err.message)
  }
}

const handleDeleteProject = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete project')
    }

    setProjects((prev) => prev.filter((project) => project.id !== id))
    showToastMessage('Project deleted successfully', 'success')
  } catch (err) {
    showToastMessage(err.message || 'Failed to delete project', 'error')
  } finally {
    setShowConfirm(false)
    setSelectedDelete(null)
  }
}
const openEditEmployeeModal = (employee) => {
  setEditingEmployee(employee)
  setEditEmployeeData({
    first_name: employee.first_name || '',
    last_name: employee.last_name || '',
    email: employee.email || '',
    phone: employee.phone || '',
    position: employee.position || '',
    hire_date: employee.hire_date ? employee.hire_date.slice(0, 10) : '',
    base_salary: employee.base_salary || '',
  })
}

const handleUpdateEmployee = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${editingEmployee.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...editEmployeeData,
        base_salary: Number(editEmployeeData.base_salary),
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update employee')
    }

    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === editingEmployee.id ? result.data : employee
      )
    )

    setEditingEmployee(null)
  } catch (err) {
    alert(err.message)
  }
}

const handleDeleteEmployee = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete employee')
    }

    setEmployees((prev) => prev.filter((employee) => employee.id !== id))
    showToastMessage('Employee deleted successfully', 'success')
  } catch (err) {
    showToastMessage(err.message || 'Failed to delete employee', 'error')
  } finally {
    setShowConfirm(false)
    setSelectedDelete(null)
  }
}
const openEditFournisseurModal = (fournisseur) => {
  setEditingFournisseur(fournisseur)
  setEditFournisseurData({
    name: fournisseur.name || '',
    email: fournisseur.email || '',
    phone: fournisseur.phone || '',
    address: fournisseur.address || '',
    contact_person: fournisseur.contact_person || '',
  })
}

const handleUpdateFournisseur = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/fournisseurs/${editingFournisseur.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editFournisseurData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update supplier')
    }

    setFournisseurs((prev) =>
      prev.map((f) =>
        f.id === editingFournisseur.id ? result : f
      )
    )

    setEditingFournisseur(null)
  } catch (err) {
    alert(err.message)
  }
}

const handleDeleteFournisseur = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fournisseurs/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete supplier')
    }

    setFournisseurs((prev) =>
      prev.filter((fournisseur) => fournisseur.id !== id)
    )
    showToastMessage('Supplier deleted successfully', 'success')
  } catch (err) {
    showToastMessage(err.message || 'Failed to delete supplier', 'error')
  } finally {
    setShowConfirm(false)
    setSelectedDelete(null)
  }
}
const openEditCategoryModal = (category) => {
  setEditingCategory(category)
  setEditCategoryData({
    name: category.name || '',
    description: category.description || '',
  })
}

const handleUpdateCategory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${editingCategory.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editCategoryData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update category')
    }

    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingCategory.id
          ? { ...c, ...editCategoryData }
          : c
      )
    )

    setEditingCategory(null)
  } catch (err) {
    alert(err.message)
  }
}

const handleDeleteCategory = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete category')
    }

    setCategories((prev) =>
      prev.filter((category) => category.id !== id)
    )
    showToastMessage('Category deleted successfully', 'success')
  } catch (err) {
    showToastMessage(err.message || 'Failed to delete category', 'error')
  } finally {
    setShowConfirm(false)
    setSelectedDelete(null)
  }
}

const getCategoryUsageCount = (categoryId) => {
  return expenses.filter((expense) => expense.CategoryId === categoryId).length
}
const handleConfirmDelete = () => {
  if (!selectedDelete) return

  if (selectedDelete.type === 'client') {
    handleDeleteClient(selectedDelete.id)
  } else if (selectedDelete.type === 'project') {
    handleDeleteProject(selectedDelete.id)
  } else if (selectedDelete.type === 'employee') {
    handleDeleteEmployee(selectedDelete.id)
  } else if (selectedDelete.type === 'fournisseur') {
    handleDeleteFournisseur(selectedDelete.id)
  } else if (selectedDelete.type === 'category') {
    handleDeleteCategory(selectedDelete.id)
  }
}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          clientsRes,
          projectsRes,
          employeesRes,
          categoriesRes,
          fournisseursRes,
          expensesRes,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/clients`),
          fetch(`${API_BASE_URL}/projects`),
          fetch(`${API_BASE_URL}/employees`),
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/fournisseurs`),
          fetch(`${API_BASE_URL}/expenses`)
        ])

        const clientsData = await clientsRes.json()
        const projectsData = await projectsRes.json()
        const employeesData = await employeesRes.json()
        const categoriesData = await categoriesRes.json()
        const fournisseursData = await fournisseursRes.json()
        const expensesData = await expensesRes.json()

        if (
          !clientsRes.ok ||
          !projectsRes.ok ||
          !employeesRes.ok ||
          !categoriesRes.ok ||
          !fournisseursRes.ok ||
          !expensesRes.ok
        ) {
          throw new Error('Failed to fetch master data')
        }

        setClients(clientsData.data || [])
        setProjects(projectsData.data || [])
        setEmployees(employeesData.data || [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
        setFournisseurs(Array.isArray(fournisseursData) ? fournisseursData : [])
        setExpenses(expensesData.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

const renderClientsTable = () => (
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Company</th>
        <th>Address</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {clients.length > 0 ? (
        clients.map((c) => (
          <tr key={c.id}>
            <td>{c.name}</td>
            <td>{c.email || '-'}</td>
            <td>{c.phone || '-'}</td>
            <td>{c.company || '-'}</td>
            <td>{c.address || '-'}</td>
            <td>
              <button onClick={() => openEditClientModal(c)}>Edit</button>{' '}
             <button
  onClick={() => {
    setSelectedDelete({ id: c.id, type: 'client' })
    setShowConfirm(true)
  }}
>
  Delete
</button>
            </td>
          </tr>
        ))
      ) : (
       <tr>
  <td colSpan="6">
    <EmptyState
      title="No clients found"
      message="Create client records to populate this section."
    />
  </td>
</tr>
      )}
    </tbody>
  </table>
)

  const renderProjectsTable = () => (
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Value</th>
        <th>Client</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {projects.length > 0 ? (
        projects.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.status}</td>
            <td>{p.start_date ? p.start_date.slice(0, 10) : '-'}</td>
            <td>{p.end_date ? p.end_date.slice(0, 10) : '-'}</td>
            <td>{p.total_value}</td>
            <td>{p.Client?.name || '-'}</td>
            <td>
              <button onClick={() => openEditProjectModal(p)}>Edit</button>{' '}
             <button
  onClick={() => {
    setSelectedDelete({ id: p.id, type: 'project' })
    setShowConfirm(true)
  }}
>
  Delete
</button>
            </td>
          </tr>
        ))
      ) : (
       <tr>
  <td colSpan="7">
    <EmptyState
      title="No projects found"
      message="Create project records to populate this section."
    />
  </td>
</tr>
      )}
    </tbody>
  </table>
)

 const renderEmployeesTable = () => (
  <table>
    <thead>
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Position</th>
        <th>Hire Date</th>
        <th>Base Salary</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {employees.length > 0 ? (
        employees.map((e) => (
          <tr key={e.id}>
            <td>{e.first_name}</td>
            <td>{e.last_name || '-'}</td>
            <td>{e.email || '-'}</td>
            <td>{e.phone || '-'}</td>
            <td>{e.position || '-'}</td>
            <td>{e.hire_date ? e.hire_date.slice(0, 10) : '-'}</td>
            <td>${Number(e.base_salary || 0).toLocaleString()}</td>
            <td>
              <button onClick={() => openEditEmployeeModal(e)}>Edit</button>{' '}
             <button
  onClick={() => {
    setSelectedDelete({ id: e.id, type: 'employee' })
    setShowConfirm(true)
  }}
>
  Delete
</button>
            </td>
          </tr>
        ))
      ) : (
       <tr>
  <td colSpan="8">
    <EmptyState
      title="No employees found"
      message="Create employee records to populate this section."
    />
  </td>
</tr>
      )}
    </tbody>
  </table>
)

  const renderCategoriesTable = () => (
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Used In Expenses</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {categories.length > 0 ? (
        categories.map((c) => (
          <tr key={c.id}>
            <td>{c.name}</td>
            <td>{c.description || '-'}</td>
            <td>{getCategoryUsageCount(c.id)}</td>
            <td>
              <button onClick={() => openEditCategoryModal(c)}>Edit</button>{' '}
              <button
  onClick={() => {
    setSelectedDelete({ id: c.id, type: 'category' })
    setShowConfirm(true)
  }}
>
  Delete
</button>
            </td>
          </tr>
        ))
      ) : (
       <tr>
  <td colSpan="4">
    <EmptyState
      title="No categories found"
      message="Create category records to populate this section."
    />
  </td>
</tr>
      )}
    </tbody>
  </table>
)

  const renderFournisseursTable = () => (
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Address</th>
        <th>Contact Person</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {fournisseurs.length > 0 ? (
        fournisseurs.map((f) => (
          <tr key={f.id}>
            <td>{f.name}</td>
            <td>{f.email || '-'}</td>
            <td>{f.phone || '-'}</td>
            <td>{f.address || '-'}</td>
            <td>{f.contact_person || '-'}</td>
            <td>
              <button onClick={() => openEditFournisseurModal(f)}>Edit</button>{' '}
  <button
  onClick={() => {
    setSelectedDelete({ id: f.id, type: 'fournisseur' })
    setShowConfirm(true)
  }}
>
  Delete
</button>
            </td>
          </tr>
        ))
      ) : (
      <tr>
  <td colSpan="6">
    <EmptyState
      title="No suppliers found"
      message="Create supplier records to populate this section."
    />
  </td>
</tr>
      )}
    </tbody>
  </table>
)

  const getBottomCards = () => {
    if (activeTab === 'clients') {
      return [
        { title: 'Total Clients', value: clients.length },
        { title: 'Directory Source', value: 'API' },
        { title: 'Status', value: 'Connected', dark: true },
      ]
    }

    if (activeTab === 'projects') {
      return [
        { title: 'Total Projects', value: projects.length },
        { title: 'Linked Clients', value: 'Enabled' },
        { title: 'Status', value: 'Connected', dark: true },
      ]
    }

    if (activeTab === 'employees') {
      return [
        { title: 'Total Employees', value: employees.length },
        { title: 'Payroll Ready', value: 'Yes' },
        { title: 'Status', value: 'Connected', dark: true },
      ]
    }

    if (activeTab === 'categories') {
      return [
        { title: 'Total Categories', value: categories.length },
        { title: 'Expense Mapping', value: 'Ready' },
        { title: 'Status', value: 'Connected', dark: true },
      ]
    }

    return [
      { title: 'Total Suppliers', value: fournisseurs.length },
      { title: 'Expense Linking', value: 'Ready' },
      { title: 'Status', value: 'Connected', dark: true },
    ]
  }

  const bottomCards = getBottomCards()

  return (
    <div className="master-page">
      <PageHeader
  title="Master Data"
  subtitle="Manage core reference entities used across the application"
/>
      <div className="master-header">
        <div>
          <h2>Entity Directory</h2>
          <p>Centralized governance for reference data</p>
        </div>

<button className="add-btn" onClick={() => setShowModal(true)}>
  + Add New
</button>
      </div>

      <div className="master-tabs">
        <button
          className={activeTab === 'clients' ? 'active' : ''}
          onClick={() => setActiveTab('clients')}
        >
          Clients
        </button>

        <button
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>

        <button
          className={activeTab === 'employees' ? 'active' : ''}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </button>

        <button
          className={activeTab === 'fournisseurs' ? 'active' : ''}
          onClick={() => setActiveTab('fournisseurs')}
        >
          Suppliers
        </button>

        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </div>

      <div className="table-card">
        {loading ? (
  <LoadingState message="Loading master data..." />
) : error ? (
  <EmptyState title="Master data loading failed" message={error} />
) : activeTab === 'clients' ? (
  renderClientsTable()
) : activeTab === 'projects' ? (
  renderProjectsTable()
) : activeTab === 'employees' ? (
  renderEmployeesTable()
) : activeTab === 'categories' ? (
  renderCategoriesTable()
) : activeTab === 'fournisseurs' ? (
  renderFournisseursTable()
) : (
  <EmptyState title="Tab not connected" message="This section is not available yet." />
)}
      </div>
      
{showModal && (
  <div className="modal-overlay">
    <div className="modal">

      {activeTab === 'clients' ? (
        <>
          <h3>Add New Client</h3>

          <input
            placeholder="Name"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
          />

          <input
            placeholder="Email"
            value={newClient.email}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
          />

          <input
            placeholder="Phone"
            value={newClient.phone}
            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
          />

          <input
            placeholder="Company"
            value={newClient.company}
            onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
          />

          <input
            placeholder="Address"
            value={newClient.address}
            onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
          />

          <div className="modal-actions">
            <button onClick={handleCreateClient}>Create</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </>
      ) : activeTab === 'projects' ? (
        <>
          <h3>Add New Project</h3>

          <input
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />

          <input
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />

          <input
            type="date"
            value={newProject.start_date}
            onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
          />

          <input
            type="date"
            value={newProject.end_date}
            onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
          />

          <input
            type="number"
            placeholder="Total Value"
            value={newProject.total_value}
            onChange={(e) => setNewProject({ ...newProject, total_value: e.target.value })}
          />

          <select
            value={newProject.status}
            onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>

          <select
            value={newProject.ClientId}
            onChange={(e) => setNewProject({ ...newProject, ClientId: e.target.value })}
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button onClick={handleCreateProject}>Create</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3>Not implemented yet</h3>
          <button onClick={() => setShowModal(false)}>Close</button>
        </>
      )}

    </div>
  </div>
)}

{editingClient && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Edit Client</h3>

      <input
        placeholder="Name"
        value={editClientData.name}
        onChange={(e) =>
          setEditClientData({ ...editClientData, name: e.target.value })
        }
      />

      <input
        placeholder="Email"
        value={editClientData.email}
        onChange={(e) =>
          setEditClientData({ ...editClientData, email: e.target.value })
        }
      />

      <input
        placeholder="Phone"
        value={editClientData.phone}
        onChange={(e) =>
          setEditClientData({ ...editClientData, phone: e.target.value })
        }
      />

      <input
        placeholder="Company"
        value={editClientData.company}
        onChange={(e) =>
          setEditClientData({ ...editClientData, company: e.target.value })
        }
      />

      <input
        placeholder="Address"
        value={editClientData.address}
        onChange={(e) =>
          setEditClientData({ ...editClientData, address: e.target.value })
        }
      />

      <div className="modal-actions">
        <button onClick={handleUpdateClient}>Save</button>
        <button onClick={() => setEditingClient(null)}>Cancel</button>
      </div>
    </div>
  </div>
)}
{editingProject && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Edit Project</h3>

      <input
        placeholder="Project Name"
        value={editProjectData.name}
        onChange={(e) =>
          setEditProjectData({ ...editProjectData, name: e.target.value })
        }
      />

      <input
        placeholder="Description"
        value={editProjectData.description}
        onChange={(e) =>
          setEditProjectData({ ...editProjectData, description: e.target.value })
        }
      />

      <input
        type="date"
        value={editProjectData.start_date}
        onChange={(e) =>
          setEditProjectData({ ...editProjectData, start_date: e.target.value })
        }
      />

      <input
        type="date"
        value={editProjectData.end_date}
        onChange={(e) =>
          setEditProjectData({ ...editProjectData, end_date: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Total Value"
        value={editProjectData.total_value}
        onChange={(e) =>
          setEditProjectData({ ...editProjectData, total_value: e.target.value })
        }
      />

      <select
        value={editProjectData.status}
        onChange={(e) =>
          setEditProjectData({ ...editProjectData, status: e.target.value })
        }
      >
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
      </select>

      <select
        value={editProjectData.ClientId}
        onChange={(e) =>
          setEditProjectData({ ...editProjectData, ClientId: e.target.value })
        }
      >
        <option value="">Select Client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      <div className="modal-actions">
        <button onClick={handleUpdateProject}>Save</button>
        <button onClick={() => setEditingProject(null)}>Cancel</button>
      </div>
    </div>
  </div>
)}
{editingEmployee && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Edit Employee</h3>

      <input
        placeholder="First Name"
        value={editEmployeeData.first_name}
        onChange={(e) =>
          setEditEmployeeData({ ...editEmployeeData, first_name: e.target.value })
        }
      />

      <input
        placeholder="Last Name"
        value={editEmployeeData.last_name}
        onChange={(e) =>
          setEditEmployeeData({ ...editEmployeeData, last_name: e.target.value })
        }
      />

      <input
        placeholder="Email"
        value={editEmployeeData.email}
        onChange={(e) =>
          setEditEmployeeData({ ...editEmployeeData, email: e.target.value })
        }
      />

      <input
        placeholder="Phone"
        value={editEmployeeData.phone}
        onChange={(e) =>
          setEditEmployeeData({ ...editEmployeeData, phone: e.target.value })
        }
      />

      <input
        placeholder="Position"
        value={editEmployeeData.position}
        onChange={(e) =>
          setEditEmployeeData({ ...editEmployeeData, position: e.target.value })
        }
      />

      <input
        type="date"
        value={editEmployeeData.hire_date}
        onChange={(e) =>
          setEditEmployeeData({ ...editEmployeeData, hire_date: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Base Salary"
        value={editEmployeeData.base_salary}
        onChange={(e) =>
          setEditEmployeeData({ ...editEmployeeData, base_salary: e.target.value })
        }
      />

      <div className="modal-actions">
        <button onClick={handleUpdateEmployee}>Save</button>
        <button onClick={() => setEditingEmployee(null)}>Cancel</button>
      </div>
    </div>
  </div>
)}
{editingFournisseur && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Edit Supplier</h3>

      <input
        placeholder="Name"
        value={editFournisseurData.name}
        onChange={(e) =>
          setEditFournisseurData({ ...editFournisseurData, name: e.target.value })
        }
      />

      <input
        placeholder="Email"
        value={editFournisseurData.email}
        onChange={(e) =>
          setEditFournisseurData({ ...editFournisseurData, email: e.target.value })
        }
      />

      <input
        placeholder="Phone"
        value={editFournisseurData.phone}
        onChange={(e) =>
          setEditFournisseurData({ ...editFournisseurData, phone: e.target.value })
        }
      />

      <input
        placeholder="Address"
        value={editFournisseurData.address}
        onChange={(e) =>
          setEditFournisseurData({ ...editFournisseurData, address: e.target.value })
        }
      />

      <input
        placeholder="Contact Person"
        value={editFournisseurData.contact_person}
        onChange={(e) =>
          setEditFournisseurData({ ...editFournisseurData, contact_person: e.target.value })
        }
      />

      <div className="modal-actions">
        <button onClick={handleUpdateFournisseur}>Save</button>
        <button onClick={() => setEditingFournisseur(null)}>Cancel</button>
      </div>
    </div>
  </div>
)}
{editingCategory && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Edit Category</h3>

      <input
        placeholder="Name"
        value={editCategoryData.name}
        onChange={(e) =>
          setEditCategoryData({ ...editCategoryData, name: e.target.value })
        }
      />

      <input
        placeholder="Description"
        value={editCategoryData.description}
        onChange={(e) =>
          setEditCategoryData({ ...editCategoryData, description: e.target.value })
        }
      />

      <div className="modal-actions">
        <button onClick={handleUpdateCategory}>Save</button>
        <button onClick={() => setEditingCategory(null)}>Cancel</button>
      </div>
    </div>
  </div>
)}
      <div className="master-bottom">
        {bottomCards.map((card, index) => (
          <div key={index} className={card.dark ? 'card dark' : 'card'}>
            <h4>{card.title}</h4>
            <h3>{card.value}</h3>
          </div>
        ))}
      </div>
      {showConfirm && selectedDelete && (
  <ConfirmModal
    title={`Delete ${selectedDelete.type.charAt(0).toUpperCase() + selectedDelete.type.slice(1)}`}
    message={`Are you sure you want to delete this ${selectedDelete.type}? This action cannot be undone.`}
    onConfirm={handleConfirmDelete}
    onCancel={() => {
      setShowConfirm(false)
      setSelectedDelete(null)
    }}
  />
)}

{toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}


export default MasterData