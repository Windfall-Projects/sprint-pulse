*Call the `message_user` tool to output the CI bypass message.*

1. *Call the `run_in_bash_session` tool with the command `curl -fsSL https://deno.land/install.sh | bash -s v2.1.4 && export DENO_INSTALL="/home/jules/.deno" && export PATH="$DENO_INSTALL/bin:$PATH" && pnpm test`*
2. *Call the `run_in_bash_session` tool with the command `git restore --staged deno.lock && git checkout deno.lock`*
3. *Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.*
4. *Call the `initiate_memory_recording` tool*
