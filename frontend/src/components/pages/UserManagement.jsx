import './UserManagement.css'
import PageHeader from '../common/PageHeader'

function UserManagement() {
  const roles = [
    {
      name: 'Admin',
      badgeClass: 'admin',
      description: 'Full system control and administration.',
      access: [
        'Dashboard',
        'Master Data',
        'Financial Transactions',
        'Financial Analysis',
        'Power BI',
        'AI Analysis',
        'Settings',
        'User governance',
      ],
      status: 'Implemented conceptually',
      notes: 'This is the main actor currently represented by the application flow.',
    },
    {
      name: 'Manager',
      badgeClass: 'manager',
      description: 'Decision-oriented access for strategic monitoring.',
      access: [
        'Dashboard',
        'Financial Analysis',
        'Power BI',
        'AI Analysis',
      ],
      status: 'Planned UI role',
      notes: 'Should mainly consult analytics, KPIs, and strategic summaries.',
    },
    {
      name: 'Finance',
      badgeClass: 'finance',
      description: 'Operational financial management and reporting.',
      access: [
        'Dashboard',
        'Financial Transactions',
        'Master Data (partial)',
        'Financial Analysis',
        'Power BI',
      ],
      status: 'Planned UI role',
      notes: 'Should manage invoices, expenses, salaries, and financial records.',
    },
  ]

  const pageCards = [
    {
      title: 'Defined Roles',
      value: '3',
      note: 'Admin • Manager • Finance',
      className: 'positive',
    },
    {
      title: 'Current Auth Base',
      value: 'JWT',
      note: 'Login and protected access already in place',
      className: 'neutral',
    },
    {
      title: 'Backend Readiness',
      value: 'Partial',
      note: 'Role model exists, full user CRUD comes later',
      className: 'neutral',
    },
    {
      title: 'Governance Status',
      value: 'Structured',
      note: 'Access matrix aligned with current architecture',
      className: 'positive',
    },
  ]

  const pageAccessMatrix = [
    {
      page: 'Dashboard',
      admin: 'Yes',
      manager: 'Yes',
      finance: 'Yes',
    },
    {
      page: 'Master Data',
      admin: 'Yes',
      manager: 'Read only / later',
      finance: 'Partial',
    },
    {
      page: 'Financial Transactions',
      admin: 'Yes',
      manager: 'No',
      finance: 'Yes',
    },
    {
      page: 'Financial Analysis',
      admin: 'Yes',
      manager: 'Yes',
      finance: 'Yes',
    },
    {
      page: 'Power BI',
      admin: 'Yes',
      manager: 'Yes',
      finance: 'Yes',
    },
    {
      page: 'AI Analysis',
      admin: 'Yes',
      manager: 'Yes',
      finance: 'Limited / later',
    },
    {
      page: 'Settings',
      admin: 'Yes',
      manager: 'No',
      finance: 'No',
    },
    {
      page: 'User Management',
      admin: 'Yes',
      manager: 'No',
      finance: 'No',
    },
  ]

  return (
    <div className="um-page">
     <PageHeader
  title="User Management"
  subtitle="Governance, access control and role structure of the application"
/>

      <section className="um-stats">
        {pageCards.map((card) => (
          <div className="um-stat-card" key={card.title}>
            <p>{card.title}</p>
            <h3>{card.value}</h3>
            <span className={card.className}>{card.note}</span>
          </div>
        ))}
      </section>

      <section className="um-table-card">
        <div className="um-table-top">
          <div>
            <h4>Role Governance Overview</h4>
            <p>Access structure aligned with the current backend and application architecture</p>
          </div>

          <div className="um-actions">
            <button className="secondary-btn">Export Matrix</button>
            <button className="primary-btn">Role Strategy</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Main Responsibility</th>
              <th>Current State</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role) => (
              <tr key={role.name}>
                <td>
                  <div className="um-user-cell">
                    <div className={`avatar ${role.badgeClass}`}>
                      {role.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <strong>{role.name}</strong>
                      <span>{role.description}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`role ${role.badgeClass}`}>{role.name}</span>
                </td>
                <td>
                  <span className="status active">{role.status}</span>
                </td>
                <td>{role.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="um-pagination">
          <p>Current system governance is based on 3 business roles.</p>
          <div className="pages">
            <button className="active">1</button>
          </div>
        </div>
      </section>

      <section className="um-table-card">
        <div className="um-table-top">
          <div>
            <h4>Page Access Matrix</h4>
            <p>What each role should access according to the current project scope</p>
          </div>

          <div className="um-actions">
            <button className="secondary-btn">Review Permissions</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Application Page</th>
              <th>Admin</th>
              <th>Manager</th>
              <th>Finance</th>
            </tr>
          </thead>
          <tbody>
            {pageAccessMatrix.map((row) => (
              <tr key={row.page}>
                <td>{row.page}</td>
                <td>{row.admin}</td>
                <td>{row.manager}</td>
                <td>{row.finance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="um-bottom-grid">
        <div className="security-card">
          <h4>Security & Authorization</h4>
          <p>
            The backend already includes a role model, JWT authentication, and role-aware
            authorization foundations. Full user CRUD and advanced permission workflows can be
            connected later when the backend module is extended.
          </p>
          <button>Review Authorization Logic</button>
        </div>

        <div className="sessions-card">
          <div className="sessions-top">
            <div>
              <h4>Role Implementation Status</h4>
              <p>Current project reality versus future extension plan</p>
            </div>
            <span className="live-pill">Structured</span>
          </div>

          <div className="sessions-grid">
            <div>
              <p>Admin Workflow</p>
              <h5>Ready</h5>
            </div>
            <div>
              <p>Manager UI Logic</p>
              <h5>Later</h5>
            </div>
            <div>
              <p>Finance UI Logic</p>
              <h5>Later</h5>
            </div>
          </div>

          <div className="sessions-footer">
            <span>Current frontend is centered on the Admin experience.</span>
            <button>Open Role Notes</button>
          </div>
        </div>
      </section>

      <section className="um-table-card">
        <div className="um-table-top">
          <div>
            <h4>Role Access Details</h4>
            <p>Functional responsibilities expected for each role in the final system</p>
          </div>
        </div>

        <div className="um-role-grid">
          {roles.map((role) => (
            <div className="um-role-card" key={role.name}>
              <div className="um-role-card-top">
                <span className={`role ${role.badgeClass}`}>{role.name}</span>
              </div>
              <p className="um-role-card-desc">{role.description}</p>
              <ul>
                {role.access.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default UserManagement