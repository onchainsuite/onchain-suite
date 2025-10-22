"use client";

import { Building, Check, ChevronsUpDown, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useAuth } from "@/hooks/client";

interface UserProject {
  projectId: string;
  projectName: string;
  projectSlug: string;
  organizationName: string | null;
  userRole: string;
  isActive: boolean;
  joinedAt: Date;
}

interface ProjectSwitcherProps {
  currentProjectId?: string;
  onProjectChange?: (projectId: string) => void;
}

export function ProjectSwitcher({
  currentProjectId,
  onProjectChange,
}: ProjectSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadUserProjects();
    }
  }, [user]);

  const loadUserProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to load user projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentProject = projects.find((p) => p.projectId === currentProjectId);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "member":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "viewer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setOpen(false);
    onProjectChange?.(projectId);
  };

  if (loading) {
    return <div className="w-[200px] h-8 bg-muted animate-pulse rounded-md" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          <div className="flex items-center gap-2">
            {currentProject ? (
              <>
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">
                    {currentProject.projectName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {currentProject.projectName}
                  </span>
                  {currentProject.organizationName && (
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {currentProject.organizationName}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <span className="text-muted-foreground">Select project...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>

            {projects.length > 0 && (
              <CommandGroup heading="Your Projects">
                {projects.map((project) => (
                  <CommandItem
                    key={project.projectId}
                    value={project.projectName}
                    onSelect={() => handleProjectSelect(project.projectId)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {project.projectName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {project.projectName}
                        </span>
                        {project.organizationName && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {project.organizationName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getRoleColor(project.userRole)}`}
                      >
                        {project.userRole}
                      </Badge>
                      {project.projectId === currentProjectId && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            <CommandSeparator />

            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  // Handle create new project
                  window.location.href = "/projects/new";
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create new project</span>
              </CommandItem>

              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  // Handle join project
                  window.location.href = "/projects/join";
                }}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                <span>Join existing project</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
