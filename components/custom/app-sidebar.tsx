'use client';

import { useRouter } from 'next/navigation';
import type { User } from 'next-auth';

import { PlusIcon, TrashIcon } from '@/components/custom/icons';
import {
  type Chats,
  SidebarHistory,
} from '@/components/custom/sidebar-history';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BetterTooltip } from '@/components/ui/tooltip';

import { SidebarUserNav } from './sidebar-user-nav';
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AppSidebar({ user }: { user?: User }) {
  const router = useRouter();
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const { setOpenMobile } = useSidebar();

  const [history, setHistory] = useLocalStorage<Chats | null>(
    `chats`,
    {
      chats: [],
    },
    {
      initializeWithValue: false,
    },
  );

  const handleDelete = () => {
    setHistory({
      chats: [],
    });
    toast.success('All chats deleted successfully');
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <Sidebar className="group-data-[side=left]:border-r-0">
        <SidebarHeader>
          <SidebarMenu>
            <div className="flex flex-row justify-between items-center">
              <div
                tabIndex={0}
                onKeyDown={(e) => {
                  setOpenMobile(false);
                  router.push('/');
                  router.refresh();
                }}
                role="button"
                className="flex flex-row gap-3 items-center"
              >
                <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                  Arcade AI
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <div
                  className={cn(
                    history?.chats.length === 0 &&
                      'cursor-not-allowed opacity-50',
                  )}
                >
                  <BetterTooltip content="Delete all chats" align="start">
                    <Button
                      variant="ghost"
                      className="p-2 h-fit"
                      disabled={history?.chats.length === 0}
                      onClick={() => setShowDeleteAllDialog(true)}
                    >
                      <TrashIcon />
                      <span className="sr-only">Delete all chats</span>
                    </Button>
                  </BetterTooltip>
                </div>
                <BetterTooltip content="New Chat" align="start">
                  <Button
                    variant="ghost"
                    className="p-2 h-fit"
                    onClick={() => {
                      setOpenMobile(false);
                      router.push('/');
                      router.refresh();
                    }}
                  >
                    <PlusIcon />
                  </Button>
                </BetterTooltip>
              </div>
            </div>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarHistory />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="gap-0 -mx-2">
          {user && (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarUserNav user={user} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarFooter>
      </Sidebar>
      <AlertDialog
        open={showDeleteAllDialog}
        onOpenChange={setShowDeleteAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              your chats.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
