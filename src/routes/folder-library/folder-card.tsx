import { OsFolder, } from "../../models";
import { Accessor, createEffect, Resource, Show } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/core";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "../../components/ui/context-menu";
import { Transition } from "solid-transition-group";
import { IconFolderFilled } from "@tabler/icons-solidjs";
import { FolderDescription } from "../../main-components/description/folder-desc";

const LibraryFolderCard = ({
  index,
  folder,
  mainParentFolder,
  onClick,
}: {
  index: Accessor<number>;
  folder: OsFolder;
  mainParentFolder: Resource<OsFolder | null>;
  onClick: (event: MouseEvent) => void;
}) => {

  return (
    <Transition
      appear={true}
      onEnter={(el, done) => {
        const a = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000 });
        a.finished.then(done);
      }}
      onExit={(el, done) => {
        const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000 });
        a.finished.then(done);
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div class="h-56 max-w-[450px] cursor-pointer relative w-full border-[1.5px] 
						border-transparent rounded-sm shadow-black/30 shadow-md flex items-center 
						justify-center overflow-hidden will-change-transform transition-all group"
            onClick={onClick}
          >

            {/* Folder Image */}
            <div class="folder-card-container inset-0"
            >
              <Show when={folder.cover_img_path}>
                <img
                  src={folder.cover_img_path && convertFileSrc(folder.cover_img_path)}
                  class="object-cover w-full h-full relative select-none"
                />
              </Show>
            </div>

            {/* Hover Overlay for Extended Description */}
            <FolderDescription
              folder={() => folder}
            />

            {/* folder.Title at Bottom */}
            <h1
              class="w-fit h-full text-md lg:text-lg xl:text-xl absolute left-0 top-0 bg-primary/80 font-semibold
								border-r-4 border-r-secondary/10 shadow-sm shadow-black/50 text-nowrap
								text-border p-1 pl-1.5 backdrop-blur-sm mix-blend-plus-darker
								group-hover:opacity-90 transition-all duration-300 will-change-auto
								[writing-mode:vertical-rl] [text-orientation:upright] [letter-spacing:0.08em]"
            >
              {folder.title}
            </h1>

          </div>
        </ContextMenuTrigger>
      </ContextMenu>
    </Transition >
  );
};

export default LibraryFolderCard;


