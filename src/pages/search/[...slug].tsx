import { useRouter } from "next/router";
import React, { useMemo } from "react";

function Slug() {
  const { query } = useRouter();

  const search = useMemo(() => {
    return query?.slug[1];
  }, [query?.slug]);

  if (!search) {
    return null;
  }
}

export default Slug;

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
