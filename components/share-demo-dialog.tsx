'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QueryHistoryItem } from "@/lib/types";
import { createDemoFromQuery, saveDemoToStorage } from "@/lib/demo-storage";
import { Share2, Check, Copy, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface ShareDemoDialogProps {
  query: QueryHistoryItem;
  userId?: string;
}

export function ShareDemoDialog({ query, userId }: ShareDemoDialogProps) {
  const [open, setOpen] = useState(false);
  const [demoUrl, setDemoUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleCreateDemo = async () => {
    setSaving(true);
    try {
      // Create demo and save to localStorage
      const demo = createDemoFromQuery(query, userId, true);
      saveDemoToStorage(demo);

      // Optionally save to server if user is authenticated
      if (userId) {
        await fetch('/api/demos/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, isPublic: true }),
        });
      }

      // Generate shareable URL
      const url = `${window.location.origin}/demo/${demo.id}`;
      setDemoUrl(url);
    } catch (error) {
      console.error('Failed to create demo:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(demoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleOpen = () => {
    window.open(demoUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Query
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Query</DialogTitle>
          <DialogDescription>
            Create a public link to share this query and its results.
          </DialogDescription>
        </DialogHeader>
        
        {!demoUrl ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">Query:</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {query.naturalLanguage}
              </p>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Public link will be accessible to anyone</p>
              <p>• Results are stored locally in browser</p>
              {userId && <p>• Your user ID will be linked to this demo</p>}
            </div>

            <Button 
              onClick={handleCreateDemo} 
              disabled={saving}
              className="w-full"
            >
              {saving ? 'Creating...' : 'Create Share Link'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={demoUrl}
                readOnly
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleOpen}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 p-3">
              <p className="text-sm text-green-900 dark:text-green-100">
                Share link created successfully! Anyone with this link can view your query.
              </p>
            </div>

            <Button 
              onClick={() => setOpen(false)}
              variant="outline"
              className="w-full"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
