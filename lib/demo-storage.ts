'use client';

import type { SavedDemo, QueryHistoryItem } from "./types";

const STORAGE_KEY = "querylens_demos";

export function saveDemoToStorage(demo: SavedDemo): void {
  if (typeof window === 'undefined') return;
  
  try {
    const demos = getAllDemosFromStorage();
    demos.push(demo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demos));
  } catch (error) {
    console.error('Failed to save demo:', error);
  }
}

export function getAllDemosFromStorage(): SavedDemo[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load demos:', error);
    return [];
  }
}

export function getDemoFromStorage(id: string): SavedDemo | null {
  const demos = getAllDemosFromStorage();
  return demos.find(d => d.id === id) || null;
}

export function deleteDemoFromStorage(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const demos = getAllDemosFromStorage().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demos));
  } catch (error) {
    console.error('Failed to delete demo:', error);
  }
}

export function getUserDemosFromStorage(userId?: string): SavedDemo[] {
  const allDemos = getAllDemosFromStorage();
  
  if (!userId) {
    // Return only public demos for anonymous users
    return allDemos.filter(d => d.isPublic);
  }
  
  // Return user's own demos plus public demos
  return allDemos.filter(d => d.userId === userId || d.isPublic);
}

export function createDemoFromQuery(
  query: QueryHistoryItem,
  userId?: string,
  isPublic: boolean = true
): SavedDemo {
  return {
    id: crypto.randomUUID(),
    userId,
    query: { ...query, userId },
    createdAt: Date.now(),
    isPublic,
  };
}
