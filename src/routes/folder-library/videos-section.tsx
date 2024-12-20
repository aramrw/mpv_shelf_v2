import { createSignal, For, Resource, Setter, Show } from "solid-js";
import { OsFolder, OsVideo, UserType } from "../../models";
import LibraryVideoCard from "./video-card";
import play_video from "../../tauri-cmds/mpv/play_video";
import ErrorAlert from "../../main-components/error-alert";
import { platform } from "@tauri-apps/plugin-os";

export default function LibraryVideosSection({
  user,
  mainParentFolder,
  osVideos,
  mutate,
}: {
  user: Resource<UserType | null>;
  mainParentFolder: Resource<OsFolder | null>;
  osVideos: Resource<OsVideo[] | null>;
  mutate: Setter<OsVideo[] | null | undefined>;
}) {
  const currentPlatform = platform();
  const [error, setError] = createSignal<string | null>();

  return (
    <>
      <Show when={error()}>
        <ErrorAlert error={error()!} />
      </Show>
      <Show when={osVideos.state === "ready" && mainParentFolder.state === "ready"}>
        <section
          class="md:px-4 overflow-hidden w-full h-fit px-2 pb-4 pt-2 relative
				border-b-white border-b-2 shadow-lg shadow-primary/10"
        >
          <ul
            class="mx-auto h-fit w-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 md:px-12 lg:grid-cols-3
					xl:grid-cols-3 gap-6 sm:gap-10 justify-center items-center"
          >
            <For each={osVideos()}>
              {(video, index) => (
                <LibraryVideoCard
                  index={index}
                  video={video}
                  mainParentFolder={mainParentFolder}
                  currentPlatform={currentPlatform}
                  mutate={mutate}
                  onClick={async () => {
                    const error = await play_video(mainParentFolder()!, osVideos()!, video, user()!);
                    if (error) {
                      setError(null);
                      setError(error);
                    }
                  }}
                />
              )}
            </For>
          </ul>
        </section>
      </Show>
    </>
  );
}
