"use client";
import { useTheme } from "next-themes";
import {BeatLoader} from "react-spinners"

import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { BotAvatar } from "@/components/bot-avatar";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export interface ChatMessageProps {
  role: "system" | "user";
  content?: string;
  isLoading?: boolean;
  src?: string;
}
const ChatMessage = ({ role, content, isLoading, src }: ChatMessageProps) => {
  const { toast } = useToast();
  const {theme} = useTheme();

  const onCopy=()=>{
    if(!content){
        return;
    }
    navigator.clipboard.writeText(content);
    toast({
        description:"Message copied to clipboard"
    });
  }
  return (
    <div className={cn(
        "group flex items-start gap-x-3 py-4 w-full",
        role === "user" && "justify-end"
    )}>
        {role!=="user" && src && <BotAvatar src={src}/>}
        <div className="rounded-md px-4 py-2 mt-2 max-w-sm text-sm bg-primary/10">
            {isLoading ? 
                <BeatLoader 
                    color={theme === "light" ? "black" : "white"}
                    size={5}
                />:
                content
            }
        </div>
        {role==="user" && <UserAvatar/>}
        {role!=="user" && !isLoading && (
            <Button
                onClick={onCopy}
                className="opacity-0 group-hover:opacity-100 transition mt-2" //ya group-hover le mathi deko group bhanne clasname match khanxa so group ma ja hover garda ni copy auxa
                size="icon"
                variant="ghost"
            > 
                <Copy className="w-4 h-4 "/>
            </Button>
        )

        }

    </div>
  )
};

export default ChatMessage;
