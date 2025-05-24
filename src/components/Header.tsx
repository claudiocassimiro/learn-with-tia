
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, BookOpen, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  userXP: number;
  userLevel: number;
  onOpenPreferences: () => void;
}

const Header = ({ userXP, userLevel, onOpenPreferences }: HeaderProps) => {
  const { profile, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TIAcher
            </h1>
            <p className="text-sm text-gray-600">
              Seu professor de IA personalizado
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Badge
            variant="secondary"
            className="bg-blue-400 hover:bg-blue-600 text-blue-900"
          >
            Nível {userLevel}
          </Badge>
          <Badge variant="outline" className="border-blue-200 text-blue-800">
            {userXP} XP
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || undefined} alt="Usuário" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {profile?.full_name 
                    ? profile.full_name.charAt(0).toUpperCase()
                    : <User className="w-5 h-5" />
                  }
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-blue-400 border-blue-600"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.full_name || 'Usuário'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-blue-600" />
            <DropdownMenuItem
              onClick={onOpenPreferences}
              className="hover:bg-blue-600 hover:text-black"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Preferências</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-blue-600" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="hover:bg-blue-600 hover:text-black"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
