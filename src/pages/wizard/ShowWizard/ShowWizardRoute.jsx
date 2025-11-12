import { useParams, useNavigate } from 'react-router-dom';
import ShowWizardPage from './ShowWizardPage';

export default function ShowWizardPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <ShowWizardPage
      wizard={{ id: Number(id) }}
      onWizardSelect={(w) => {
        if (!w) navigate('/wizard');
        else navigate(`/wizard/${w.id}`);
      }}
    />
  );
}
