/**
 * Mock workspaces data (temporary replacement for API)
 */
export const MOCK_WORKSPACES = [
    {
      id: '1',
      name: 'Ttay Main',
      plan: 'pro',
      created_at: '2024/08/10',
      my_role: 'owner', // owner | admin | member
    },
    {
      id: '2',
      name: 'Dev Team',
      plan: 'free',
      created_at: '2025/01/03',
      my_role: 'member',
    },
  ];
  
  /**
   * Mock members data (temporary replacement for API)
   */
  export const MOCK_MEMBERS = {
    '1': [
      {
        id: 'u1',
        name: 'Nastaran',
        email: 'nastaran@test.com',
        role: 'owner',
        joined_at: '2024/08/10',
      },
      {
        id: 'u2',
        name: 'Mahya',
        email: 'mahya@test.com',
        role: 'admin',
        joined_at: '2024/09/01',
      },
      {
        id: 'u3',
        name: 'Sara',
        email: 'sara@test.com',
        role: 'member',
        joined_at: '2024/10/15',
      },
    ],
    '2': [
      {
        id: 'u1',
        name: 'Nastaran',
        email: 'nastaran@test.com',
        role: 'member',
        joined_at: '2025/01/03',
      },
    ],
  };  