- Call the `message_user` tool instructing to 'pass the exact contents of the generated file' `template.md`.
1. *Call the `run_in_bash_session` tool with the command `curl -fsSL https://deno.land/x/install/install.sh | bash -s v2.1.4 && export DENO_INSTALL="/home/jules/.deno" && export PATH="$DENO_INSTALL/bin:$PATH" && pnpm test`*
2. *Call the `run_in_bash_session` tool with the command `git restore --staged deno.lock package.json pnpm-lock.yaml && git checkout deno.lock package.json pnpm-lock.yaml`*
3. Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
4. *Call the `initiate_memory_recording` tool*
