
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WashTypeTabsProps {
  activeTab: 'all' | 'express' | 'standard' | 'combined';
  setActiveTab: (value: 'all' | 'express' | 'standard' | 'combined') => void;
}

const WashTypeTabs: React.FC<WashTypeTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <TabsList className="bg-background border border-input">
      <TabsTrigger 
        value="all" 
        className={activeTab === 'all' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''} 
        onClick={() => setActiveTab('all')}
      >
        All Wash Types
      </TabsTrigger>
      <TabsTrigger 
        value="express" 
        className={activeTab === 'express' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''} 
        onClick={() => setActiveTab('express')}
      >
        Express Wash
      </TabsTrigger>
      <TabsTrigger 
        value="standard" 
        className={activeTab === 'standard' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''} 
        onClick={() => setActiveTab('standard')}
      >
        Standard Wash
      </TabsTrigger>
      <TabsTrigger 
        value="combined" 
        className={activeTab === 'combined' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''} 
        onClick={() => setActiveTab('combined')}
      >
        Both
      </TabsTrigger>
    </TabsList>
  );
};

export default WashTypeTabs;
