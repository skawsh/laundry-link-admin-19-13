import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { mockStudios } from '@/data/mockServiceData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  const navigateToStudios = () => {
    navigate('/studios');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          
        </div>
      </div>
    </AdminLayout>
  );
};

export default Index;
