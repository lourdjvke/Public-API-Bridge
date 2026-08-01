import { useQuery } from '@tanstack/react-query';

export interface BreacherStats {
  poolSize: number;
  validated: number;
  unvalidated: number;
  harvesting: number;
  totalHarvested: number;
}

const fetchStats = async (): Promise<BreacherStats> => {
  try {
    const res = await fetch('/api/breacher/stats');
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  } catch (error) {
    // If backend is not available, return simulated data for the landing page demonstration
    return {
      poolSize: 42891,
      validated: 39102,
      unvalidated: 3789,
      harvesting: 142,
      totalHarvested: 8914022,
    };
  }
};

export function useStats() {
  return useQuery({
    queryKey: ['breacher-stats'],
    queryFn: fetchStats,
    refetchInterval: 5000, // Refresh every 5s to make it feel alive
  });
}
