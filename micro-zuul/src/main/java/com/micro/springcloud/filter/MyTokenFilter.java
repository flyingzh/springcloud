package com.micro.springcloud.filter;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;

public class MyTokenFilter extends ZuulFilter{

	@Override
	public boolean shouldFilter() {
		return true;
	}

	@Override
	public Object run() throws ZuulException {
		RequestContext currentContext = RequestContext.getCurrentContext();
		HttpServletRequest request = currentContext.getRequest();
		String parameter = request.getParameter("token");
		if(parameter == null || parameter.isEmpty()) {
			currentContext.setSendZuulResponse(false);
			currentContext.setResponseStatusCode(401);
			try {
				currentContext.getResponse().getWriter().write("token is empty");
			} catch (IOException e) {
				
			}
		}
		return null;
	}

	@Override
	public String filterType() {
		return "pre";
	}

	@Override
	public int filterOrder() {
		return 0;
	}

}
