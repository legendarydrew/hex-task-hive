
import { Layout } from '@/components/Layout';
import { AppProvider } from '@/context/AppContext';

const Index = () => {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
};

export default Index;
