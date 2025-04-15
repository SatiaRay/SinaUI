import Chat from '../components/Chat/Chat';
import DataSources from '../components/DataSources/DataSources';

{
  path: '/chat',
  element: <Chat />,
},
{
  path: '/data-sources',
  element: (
    <PrivateRoute>
      <Navbar />
      <DataSources />
    </PrivateRoute>
  ),
}, 