import {
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuChevronRight,
} from "react-icons/lu";
import { Button } from "../ui/button";
import { join, sep } from "@tauri-apps/api/path";
import { useAddress } from "@/hooks/explorer";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";

export function Address() {
  const { queue, path, push, back, advance } = useAddress();
  const { data: parentPath } = useQuery({
    queryKey: ["explorer", path, "parent"],
    queryFn: async () => await join(path ?? "/", ".."),
  });

  const pathArray = path?.split(sep());

  return (
    <div className="flex gap-2 items-center">
      <Button onClick={back}>
        <LuArrowLeft />
      </Button>
      <Button disabled={!queue.length} onClick={advance}>
        <LuArrowRight />
      </Button>
      <Button
        disabled={parentPath === path}
        onClick={() => {
          if (parentPath) push(parentPath);
        }}
      >
        <LuArrowUp />
      </Button>
      <div className="py-1 px-4 flex overflow-x-auto w-full rounded-md bg-gray-700/30 items-center">
        {pathArray?.map((name, index) => (
          <Fragment key={`${index}-${name}`}>
            {name && (
              <Button
                size="sm"
                variant="ghost"
                onClick={async () =>
                  push(await join(...pathArray.slice(0, index + 1)))
                }
              >
                {name}
              </Button>
            )}
            <LuChevronRight className="last:hidden shrink-0" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
