# Use Microsoft TypeScript-Node base image as foundation
FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Arguments
ARG CLAUDE_CODE_VERSION=latest
ARG USERNAME=node

# Install additional system dependencies including aggregate for firewall script
RUN apt-get update && apt-get install -y --no-install-recommends \
    sudo \
    iptables \
    ipset \
    iproute2 \
    dnsutils \
    aggregate \
    gh \
    zsh \
    fzf \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set up bash history persistence
RUN mkdir -p /commandhistory \
    && touch /commandhistory/.bash_history \
    && chown -R $USERNAME /commandhistory

# Set DEVCONTAINER environment variable
ENV DEVCONTAINER=true

# Create workspace and Claude config directories
RUN mkdir -p /workspace /home/node/.claude \
    && chown -R $USERNAME /workspace /home/node/.claude

# Set up git-delta for better diff display
ARG GIT_DELTA_VERSION=0.18.2
RUN ARCH=$(dpkg --print-architecture) \
    && wget "https://github.com/dandavison/delta/releases/download/${GIT_DELTA_VERSION}/git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" \
    && sudo dpkg -i "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" \
    && rm "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb"

# Install global package managers
ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH=$PATH:/usr/local/share/npm-global/bin
RUN npm install -g pnpm bun

# Install Claude Code
RUN npm install -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}

# Install Playwright browsers and dependencies
RUN npx playwright install-deps && \
    npx playwright install

# Set up shell configuration
ENV SHELL=/bin/zsh
RUN echo 'unset NODE_OPTIONS' >> ~/.zshrc && \
    echo 'export PROMPT_COMMAND="history -a" && export HISTFILE=/commandhistory/.bash_history' >> ~/.zshrc

# Install zsh plugins
ARG ZSH_IN_DOCKER_VERSION=1.2.0
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v${ZSH_IN_DOCKER_VERSION}/zsh-in-docker.sh)" -- \
    -p git \
    -p fzf \
    -a "source /usr/share/doc/fzf/examples/key-bindings.zsh" \
    -a "source /usr/share/doc/fzf/examples/completion.zsh" \
    -x

# Set default editor
ENV EDITOR=nano
ENV VISUAL=nano

# Copy and set up firewall script
COPY .devcontainer/init-firewall.sh /usr/local/bin/
USER root
RUN chmod +x /usr/local/bin/init-firewall.sh && \
    echo "node ALL=(root) NOPASSWD: /usr/local/bin/init-firewall.sh" > /etc/sudoers.d/node-firewall && \
    chmod 0440 /etc/sudoers.d/node-firewall
USER node

# Set working directory
WORKDIR /workspace
