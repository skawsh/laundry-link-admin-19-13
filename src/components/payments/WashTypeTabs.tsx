
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WashTypeTabsProps {
  mainWashTypeTab: 'all' | 'express' | 'standard' | 'combined';
  setMainWashTypeTab: (value: 'all' | 'express' | 'standard' | 'combined') => void;
}

const WashTypeTabs: React.FC<WashTypeTabsProps> = ({ mainWashTypeTab, setMainWashTypeTab }) => {
  return (
    <TabsList className="bg-background border border-input">
      <TabsTrigger 
        value="all" 
        className={mainWashTypeTab === 'all' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''} 
        onClick={() => setMainWashTypeTab('all')}
      >
        All Wash Types
      </TabsTrigger>
      <TabsTrigger 
        value="express" 
        className={mainWashTypeTab === 'express' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''} 
        onClick={() => setMainWashTypeTab('express')}
      >
        Express Wash
      </TabsTrigger>
      <TabsTrigger 
        value="standard" 
        className={mainWashTypeTab === 'standard' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''} 
        onClick={() => setMainWashTypeTab('standard')}
      >
        Standard Wash
      </TabsTrigger>
      <TabsTrigger 
        value="combined" 
        className={mainWashTypeTab === 'combined' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''} 
        onClick={() => setMainWashTypeTab('combined')}
      >
        Both
      </TabsTrigger>
    </TabsList>
  );
};

export default WashTypeTabs;
