"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (value: string) => void; 
};