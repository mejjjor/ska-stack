import * as React from "react";
import { Login } from "~/routes/__layout/login";

export default () => {
  return (
    <div>
      Un form d'édition
      <div>
        <Login actionData={undefined} loaderData={{ title: "welcome  !" }} />
      </div>
    </div>
  );
};
