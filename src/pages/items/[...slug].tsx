import ItemForm from "@/components/ItemForm";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

function Slug() {
  const { query } = useRouter();

  const id = useMemo(() => {
    if (!query?.slug) return null;
    if (query?.slug[0] === "create") {
      return null;
    }
    return query?.slug[1];
  }, [query?.slug]);

  const mode = useMemo(() => {
    if (!query?.slug) return "view";
    if (query?.slug[0] === "create") {
      return "create";
    }
    if (query?.slug[0] === "edit") {
      return "edit";
    }
    return "view";
  }, [query?.slug]);

  const { data: item } = useQuery(
    ["items", id],
    async () => {
      const res = await fetch(`/api/items/${id}`);
      const json = await res.json();
      return json;
    },
    { enabled: !!id }
  );

  return mode === "view" ? (
    <div>View item</div>
  ) : (
    <ItemForm mode={mode} item={query.slug} />
  );
}

export default Slug;

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
