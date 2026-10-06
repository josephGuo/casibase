// Copyright 2023 The OpenAgent Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import i18next from "i18next";
import dayjs from "dayjs";
import * as ToolBackend from "@/backend/ToolBackend";
import {Badge} from "@/components/ui/badge";
import {ProviderTypeLabel} from "@/components/common/ProviderLogo";
import {CrudListPage} from "@/components/crud/CrudListPage";
import {boolColumn, dateColumn, linkColumn, textColumn} from "@/components/crud/columns";
import type {ColumnDef} from "@/components/crud/types";
import * as Setting from "@/lib/setting";
import {getToolFunctions} from "@/lib/tool-functions";

function newTool() {
  return {
    owner: "admin",
    name: `tool_${Setting.getRandomName()}`,
    createdTime: dayjs().format(),
    displayName: "",
    displayName2: "",
    type: "time",
    subType: "Default",
    clientId: "",
    clientSecret: "",
    providerUrl: "",
    enableProxy: false,
    testContent: "",
    modelProvider: "",
    resultSummary: "",
    state: "Active",
  };
}

export default function ToolListPage() {
  const columns: ColumnDef<any>[] = [
    linkColumn({dataIndex: "name", to: (r) => `/tools/${r.name}`, width: 180}),
    {
      dataIndex: "type",
      title: i18next.t("general:Type"),
      width: 160,
      sortable: true,
      searchable: true,
      render: (value) => (value ? <ProviderTypeLabel category="Tool" type={value} /> : null),
    },
    textColumn({dataIndex: "subType", title: i18next.t("provider:Sub type"), width: 140}),
    {
      dataIndex: "functions",
      title: i18next.t("tool:Functions"),
      width: 220,
      render: (_value, record) => (
        <div className="flex flex-col gap-1">
          {getToolFunctions(record).map((fn) => (
            <Badge key={fn.name} variant="outline" className="w-fit font-mono">{fn.name}</Badge>
          ))}
        </div>
      ),
    },
    boolColumn({dataIndex: "enableProxy", title: i18next.t("provider:Enable proxy")}),
    {
      dataIndex: "state",
      title: i18next.t("general:State"),
      width: 100,
      sortable: true,
      render: (value) => <Badge variant={value === "Active" ? "success" : "secondary"}>{value}</Badge>,
    },
    dateColumn(),
  ];

  return (
    <CrudListPage
      title={i18next.t("general:Tools")}
      columns={columns}
      fetch={(q) => ToolBackend.getTools("admin", q.page, q.pageSize, q.searchedColumn, q.searchText, q.sortField, q.sortOrder)}
      newRecord={newTool}
      editUrl={(r) => `/tools/${r.name}`}
      remove={(r) => ToolBackend.deleteTool(r)}
    />
  );
}
