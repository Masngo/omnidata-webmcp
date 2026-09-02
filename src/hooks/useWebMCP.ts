'use client';

import { useEffect } from 'react';
import { registerWebMCPTools } from '../lib/webmcp';

export function useWebMCP() {
  useEffect(() => {
    registerWebMCPTools();
  }, []);
}
