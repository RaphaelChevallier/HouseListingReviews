"use client";

import EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { AutoCompleteAddress } from "@/types/radar";
import debounce from "lodash.debounce";
import { MapPin } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";

import { toast } from "@/hooks/use-toast";
import { uploadFiles } from "@/lib/uploadthing";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { useMutation } from "@tanstack/react-query";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import axios from "axios";

import "@/styles/editor.css";

type FormData = z.infer<typeof PostValidator>;

interface EditorProps {}

export const Editor: React.FC<EditorProps> = ({}) => {
  const {
    isFetching,
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(
        `/api/search?q=${input}&searchType=address`
      );
      return data.addresses as AutoCompleteAddress[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      title: "",
      listingUrl: "",
      address: "",
      content: null,
    },
  });
  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const _listingUrlRef = useRef<HTMLTextAreaElement>(null);
  const _addressRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<boolean>(false);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const pathname = usePathname();

  useOnClickOutside(_addressRef, () => {
    setSelectedAddress(true);
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      listingUrl,
      address,
      streetAddress,
      postalCode,
      city,
      country,
      county,
      longitude,
      latitude,
      content,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        title,
        listingUrl,
        address,
        streetAddress,
        postalCode,
        city,
        country,
        county,
        longitude,
        latitude,
        content,
      };
      const { data } = await axios.post("/api/subreddit/post/create", payload);
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not published. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // turn pathname /r/mycommunity/submit into /r/mycommunity
      const newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathname);

      router.refresh();

      return toast({
        description: "Your post has been published.",
      });
    },
  });

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // upload to uploadthing
                  const [res] = await uploadFiles([file], "imageUploader");

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        value;
        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef?.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  async function onSubmit(data: FormData) {
    console.log(data);
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      listingUrl: data.listingUrl,
      address: data.address,
      streetAddress: data.streetAddress,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      county: data.county,
      longitude: data.longitude,
      latitude: data.latitude,
      content: blocks,
    };

    createPost(payload);
  }

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = register("title");

  const { ref: listingUrlRef, ...rest1 } = register("listingUrl");

  const { ref: addressRef, ...rest2 } = register("address");

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full mb-2 resize-none appearance-none overflow-hidden bg-transparent text-3xl font-bold focus:outline-none border-b-2 border-black"
          />
          <TextareaAutosize
            ref={(e) => {
              listingUrlRef(e);
              // @ts-ignore
              _listingUrlRef.current = e;
            }}
            {...rest1}
            placeholder="Paste listing url here"
            className="w-full mb-2 resize-none appearance-none overflow-hidden bg-transparent text-md focus:outline-none border-b-2 border-slate-400 text-blue-400"
          />
          <Command
            ref={(e) => {
              addressRef(e);
              // @ts-ignore
              _addressRef.current = e;
            }}
            className="relative rounded-lg border max-w-lg z-50 overflow-visible"
          >
            <CommandInput
              isLoading={isFetching}
              onValueChange={(text) => {
                setSelectedAddress(false);
                setInput(text);
                debounceRequest();
              }}
              value={input}
              className="outline-none border-none focus:border-none focus:outline-none ring-0"
              placeholder="Search your address..."
            />

            {!selectedAddress && (
              <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
                {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
                {(queryResults?.length ?? 0) > 0 ? (
                  <CommandGroup heading="Addresses">
                    {queryResults?.map((autoCompleteAddress) => (
                      <CommandItem
                        onSelect={() => {
                          setSelectedAddress(true);
                        }}
                        key={
                          autoCompleteAddress.latitude +
                          autoCompleteAddress.longitude
                        }
                        value={autoCompleteAddress.formattedAddress}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        <a onClick={() => setInput(autoCompleteAddress.formattedAddress)}>{autoCompleteAddress.formattedAddress}</a>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : null}
              </CommandList>
            )}
          </Command>
          <div id="editor" className="min-h-[500px]" />
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>
      </form>
    </div>
  );
};
